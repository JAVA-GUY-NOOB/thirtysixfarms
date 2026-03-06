package com.farmcity.service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.farmcity.config.MpesaConfig;
import com.farmcity.entity.CustomerOrder;
import com.farmcity.entity.MpesaTransaction;
import com.farmcity.repository.CustomerOrderRepository;
import com.farmcity.repository.MpesaTransactionRepository;

@Service
public class MpesaService {
    private static final Logger log = LoggerFactory.getLogger(MpesaService.class);
    private static final String CHECKOUT_REQUEST_ID = "CheckoutRequestID";

    private final MpesaConfig config;
    private final RestTemplate restTemplate = new RestTemplate();
    private final MpesaTransactionRepository repo;
    private final CustomerOrderRepository orderRepo;

    public MpesaService(MpesaConfig config, MpesaTransactionRepository repo, CustomerOrderRepository orderRepo) {
        this.config = config;
        this.repo = repo;
        this.orderRepo = orderRepo;
    }

    @SuppressWarnings("null")
    public String getAccessToken() {
        String credentials = config.getConsumerKey() + ":" + config.getConsumerSecret();
        String encoded = Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encoded);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        String url = config.getBaseUrl() + "/oauth/v1/generate?grant_type=client_credentials";
        long startMs = System.currentTimeMillis();
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            url,HttpMethod.GET,
            entity, 
            new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {}
        );
        log.debug("[Mpesa] Token request status={} elapsedMs={}", response.getStatusCode(), System.currentTimeMillis()-startMs);
        Map<String, Object> body = response.getBody();
        if (body == null) return null;
        Object token = body.get("access_token");
        if (token == null) {
            log.warn("[Mpesa] No access_token field in token response body={}", body);
        } else {
            String t = token.toString();
            int prefixLen = Math.min(6, t.length());
            String prefix = prefixLen > 0 ? t.substring(0, prefixLen) : "";
            log.debug("[Mpesa] Access token acquired prefix={}*** length={} chars", prefix, t.length());
        }
        return token == null ? null : token.toString();
    }

    @SuppressWarnings("null")
    public Map<String, Object> stkPush(String phoneNumber, int amount, String accountReference, String description) {
        String token = getAccessToken();
        if (token == null) {
            throw new IllegalStateException("Unable to obtain M-Pesa access token");
        }
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String passwordRaw = config.getShortcode() + config.getPasskey() + timestamp;
        String password = Base64.getEncoder().encodeToString(passwordRaw.getBytes(StandardCharsets.UTF_8));

        Map<String, Object> payload = new HashMap<>();
        payload.put("BusinessShortCode", config.getShortcode());
        payload.put("Password", password);
        payload.put("Timestamp", timestamp);
        payload.put("TransactionType", "CustomerPayBillOnline");
        payload.put("Amount", amount);
        payload.put("PartyA", phoneNumber);
        payload.put("PartyB", config.getShortcode());
        payload.put("PhoneNumber", phoneNumber);
        payload.put("CallBackURL", config.getCallbackUrl());
        payload.put("AccountReference", accountReference);
        payload.put("TransactionDesc", description);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        String url = config.getBaseUrl() + "/mpesa/stkpush/v1/processrequest";
        long startPush = System.currentTimeMillis();
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            url,
            org.springframework.http.HttpMethod.POST,
            entity,
            new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {}
        );
        log.info("[Mpesa] STK push status={} elapsedMs={}", response.getStatusCode(), System.currentTimeMillis()-startPush);
        Map<String, Object> body = response.getBody();
        Map<String, Object> result = body == null ? new HashMap<>() : body;
        log.debug("[Mpesa] STK push response body={}", result);

        // Persist initiation if IDs present
        // Find or create order
        CustomerOrder order = orderRepo.findByReferenceCode(accountReference)
            .orElseGet(() -> {
                CustomerOrder o = new CustomerOrder();
                o.setReferenceCode(accountReference);
                o.setAmount(amount); // decide unit consistency
                o.setStatus("PENDING");
                return orderRepo.save(o);
            });

        MpesaTransaction tx = new MpesaTransaction();
        tx.setPhone(phoneNumber);
        tx.setAmount(amount);
        tx.setReferenceCode(accountReference);
        tx.setDescription(description);
        tx.setStatus("INITIATED");
        tx.setOrder(order);
        if (result.get("MerchantRequestID") != null) tx.setMerchantRequestId(String.valueOf(result.get("MerchantRequestID")));
        if (result.get(CHECKOUT_REQUEST_ID) != null) tx.setCheckoutRequestId(String.valueOf(result.get(CHECKOUT_REQUEST_ID)));
        repo.save(tx);
        return result;
    }

    public void processCallback(Map<String, Object> callback) {
        if (callback == null) return;
        Map<?,?> stk = extractStkCallback(callback);
        if (stk == null) {
            log.warn("[Mpesa] No stkCallback found in callback body={}", callback);
            return;
        }

        String checkoutRequestId = String.valueOf(stk.get(CHECKOUT_REQUEST_ID));
        log.info("[Mpesa] Processing callback for checkoutRequestId={}", checkoutRequestId);

        if (checkoutRequestId == null || checkoutRequestId.isBlank()) {
            log.warn("[Mpesa] Missing checkoutRequestId in stkCallback={}", stk);
            return;
        }

        repo.findByCheckoutRequestId(checkoutRequestId).ifPresentOrElse(tx -> {
            updateTransactionFromCallback(tx, stk, checkoutRequestId);
            updateOrderFromCallback(tx, stk);
            extractAndSetReceiptNumber(tx, stk);
            repo.save(tx);
        }, () -> log.warn("[Mpesa] No transaction found for checkoutRequestId={}", checkoutRequestId));
    }

    private Map<?,?> extractStkCallback(Map<String, Object> callback) {
        Object bodyObj = callback.get("Body");
        if (!(bodyObj instanceof Map)) return new HashMap<>();
        Map<?,?> body = (Map<?,?>) bodyObj;
        Object stkObj = body.get("stkCallback");
        if (!(stkObj instanceof Map)) return new HashMap<>();
        return (Map<?,?>) stkObj;
    }

    private void updateTransactionFromCallback(MpesaTransaction tx, Map<?,?> stk, String checkoutRequestId) {
        String resultCode = String.valueOf(stk.get("ResultCode"));
        String resultDesc = String.valueOf(stk.get("ResultDesc"));
        tx.setResultCode(resultCode);
        tx.setResultDesc(resultDesc);
        boolean success = "0".equals(resultCode);
        tx.setStatus(success ? "CALLBACK_SUCCESS" : "CALLBACK_FAILED");
        log.info("[Mpesa] Callback outcome checkoutRequestId={} success={} code={} desc={}", checkoutRequestId, success, resultCode, resultDesc);
    }

    private void updateOrderFromCallback(MpesaTransaction tx, Map<?,?> stk) {
        String resultCode = String.valueOf(stk.get("ResultCode"));
        boolean success = "0".equals(resultCode);
        CustomerOrder order = tx.getOrder();
        if (order != null) {
            order.setStatus(success ? "PAID" : "FAILED");
            orderRepo.save(order);
            log.debug("[Mpesa] Order {} updated to status {}", order.getReferenceCode(), order.getStatus());
        }
    }

    private void extractAndSetReceiptNumber(MpesaTransaction tx, Map<?,?> stk) {
        Object metaObj = stk.get("CallbackMetadata");
        if (!(metaObj instanceof Map)) return;
        Object itemsObj = ((Map<?,?>) metaObj).get("Item");
        if (!(itemsObj instanceof Iterable<?>)) return;
        Iterable<?> iterable = (Iterable<?>) itemsObj;
        for (Object item : iterable) {
            if (item instanceof Map) {
                Object name = ((Map<?,?>) item).get("Name");
                if ("MpesaReceiptNumber".equals(name)) {
                    Object value = ((Map<?,?>) item).get("Value");
                    if (value != null) tx.setReceiptNumber(String.valueOf(value));
                }
            }
        }
    }

    public Map<String, Object> getStatus(String checkoutRequestId) {
        return repo.findByCheckoutRequestId(checkoutRequestId)
            .map(tx -> {
                Map<String, Object> m = new HashMap<>();
                m.put("checkoutRequestId", tx.getCheckoutRequestId());
                m.put("merchantRequestId", tx.getMerchantRequestId());
                m.put("status", tx.getStatus());
                m.put("resultCode", tx.getResultCode());
                m.put("resultDesc", tx.getResultDesc());
                m.put("receiptNumber", tx.getReceiptNumber());
                CustomerOrder order = tx.getOrder();
                if (order != null) {
                    m.put("orderReference", order.getReferenceCode());
                    m.put("orderStatus", order.getStatus());
                }
                return m;
            })
            .orElseGet(HashMap::new);
    }
}
