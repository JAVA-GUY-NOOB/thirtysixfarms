package com.farmcity.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.farmcity.entity.CustomerOrder;
import com.farmcity.entity.UserAccount;
import com.farmcity.repository.CustomerOrderRepository;
import com.farmcity.repository.UserAccountRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserAccountRepository userAccountRepository;
    private final CustomerOrderRepository customerOrderRepository;

    public AdminController(UserAccountRepository userAccountRepository,
                         CustomerOrderRepository customerOrderRepository) {
        this.userAccountRepository = userAccountRepository;
        this.customerOrderRepository = customerOrderRepository;
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long totalUsers = userAccountRepository.count();
        long totalOrders = customerOrderRepository.count();
        long totalCustomers = userAccountRepository.countByRole("USER");
        long totalAdmins = userAccountRepository.countByRole("ADMIN");

        // Calculate revenue
        List<CustomerOrder> paidOrders = customerOrderRepository.findAll().stream()
                .filter(o -> "PAID".equals(o.getPaymentStatus()))
                .collect(Collectors.toList());

        double totalRevenue = paidOrders.stream()
                .mapToDouble(CustomerOrder::getTotalAmount)
                .sum();

        // Today's orders
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        long todayOrders = customerOrderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().isAfter(today))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalOrders", totalOrders);
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalAdmins", totalAdmins);
        stats.put("totalRevenue", totalRevenue);
        stats.put("todayOrders", todayOrders);
        stats.put("pendingOrders", customerOrderRepository.findAll().stream()
                .filter(o -> "PENDING".equals(o.getStatus())).count());
        stats.put("completedOrders", customerOrderRepository.findAll().stream()
                .filter(o -> "PAID".equals(o.getStatus())).count());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Map<String, Object>>> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String county) {

        List<CustomerOrder> orders = customerOrderRepository.findAll();

        // Filter by status if provided
        if (status != null && !status.isEmpty()) {
            orders = orders.stream()
                    .filter(o -> status.equals(o.getStatus()))
                    .collect(Collectors.toList());
        }

        // Filter by county if provided
        if (county != null && !county.isEmpty()) {
            orders = orders.stream()
                    .filter(o -> county.equalsIgnoreCase(o.getDeliveryCounty()))
                    .collect(Collectors.toList());
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (CustomerOrder order : orders) {
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("id", order.getId());
            orderMap.put("referenceCode", order.getReferenceCode());
            orderMap.put("totalAmount", order.getTotalAmount());
            orderMap.put("currency", order.getCurrency());
            orderMap.put("status", order.getStatus());
            orderMap.put("paymentStatus", order.getPaymentStatus());
            orderMap.put("paymentMethod", order.getPaymentMethod());
            orderMap.put("deliveryStatus", order.getDeliveryStatus());
            orderMap.put("deliveryAddress", order.getDeliveryAddress());
            orderMap.put("deliveryCity", order.getDeliveryCity());
            orderMap.put("deliveryCounty", order.getDeliveryCounty());
            orderMap.put("deliveryLatitude", order.getDeliveryLatitude());
            orderMap.put("deliveryLongitude", order.getDeliveryLongitude());
            orderMap.put("createdAt", order.getCreatedAt());
            orderMap.put("updatedAt", order.getUpdatedAt());

            if (order.getUser() != null) {
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", order.getUser().getId());
                userMap.put("username", order.getUser().getUsername());
                userMap.put("fullName", order.getUser().getFullName());
                userMap.put("phoneNumber", order.getUser().getPhoneNumber());
                orderMap.put("user", userMap);
            }

            result.add(orderMap);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        List<UserAccount> users = userAccountRepository.findAll();

        List<Map<String, Object>> result = new ArrayList<>();
        for (UserAccount user : users) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            userMap.put("firstName", user.getFirstName());
            userMap.put("lastName", user.getLastName());
            userMap.put("fullName", user.getFullName());
            userMap.put("phoneNumber", user.getPhoneNumber());
            userMap.put("role", user.getRole());
            userMap.put("isActive", user.getIsActive());
            userMap.put("city", user.getCity());
            userMap.put("county", user.getCounty());
            userMap.put("latitude", user.getLatitude());
            userMap.put("longitude", user.getLongitude());
            userMap.put("createdAt", user.getCreatedAt());
            userMap.put("lastLogin", user.getLastLogin());

            // Count orders for this user
            long orderCount = customerOrderRepository.findAll().stream()
                    .filter(o -> user.getId().equals(o.getUserId()))
                    .count();
            userMap.put("orderCount", orderCount);

            result.add(userMap);
        }

        return ResponseEntity.ok(result);
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");
        String deliveryStatus = body.get("deliveryStatus");

        CustomerOrder order = customerOrderRepository.findById(id)
                .orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        if (status != null) {
            order.setStatus(status);
        }
        if (deliveryStatus != null) {
            order.setDeliveryStatus(deliveryStatus);
        }

        customerOrderRepository.save(order);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Order status updated");
        response.put("orderId", order.getId());
        response.put("status", order.getStatus());
        response.put("deliveryStatus", order.getDeliveryStatus());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<Map<String, Object>>> getRevenueData(
            @RequestParam(defaultValue = "month") String period) {

        List<CustomerOrder> paidOrders = customerOrderRepository.findAll().stream()
                .filter(o -> "PAID".equals(o.getPaymentStatus()))
                .collect(Collectors.toList());

        Map<String, Double> revenueMap = new HashMap<>();
        DateTimeFormatter formatter;

        if ("day".equals(period)) {
            formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        } else if ("month".equals(period)) {
            formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        } else {
            formatter = DateTimeFormatter.ofPattern("yyyy");
        }

        for (CustomerOrder order : paidOrders) {
            if (order.getCreatedAt() != null) {
                String key = order.getCreatedAt().format(formatter);
                revenueMap.merge(key, order.getTotalAmount(), Double::sum);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Double> entry : revenueMap.entrySet()) {
            Map<String, Object> data = new HashMap<>();
            data.put("period", entry.getKey());
            data.put("revenue", entry.getValue());
            result.add(data);
        }

        result.sort((a, b) -> ((String) a.get("period")).compareTo((String) b.get("period")));

        return ResponseEntity.ok(result);
    }

    @GetMapping("/orders-by-county")
    public ResponseEntity<List<Map<String, Object>>> getOrdersByCounty() {
        List<CustomerOrder> orders = customerOrderRepository.findAll();

        Map<String, Long> countyMap = orders.stream()
                .filter(o -> o.getDeliveryCounty() != null && !o.getDeliveryCounty().isEmpty())
                .collect(Collectors.groupingBy(
                        CustomerOrder::getDeliveryCounty,
                        Collectors.counting()
                ));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Long> entry : countyMap.entrySet()) {
            Map<String, Object> data = new HashMap<>();
            data.put("county", entry.getKey());
            data.put("orderCount", entry.getValue());

            // Calculate average latitude and longitude for this county
            List<CustomerOrder> countyOrders = orders.stream()
                    .filter(o -> entry.getKey().equals(o.getDeliveryCounty()))
                    .filter(o -> o.getDeliveryLatitude() != null && o.getDeliveryLongitude() != null)
                    .collect(Collectors.toList());

            if (!countyOrders.isEmpty()) {
                double avgLat = countyOrders.stream()
                        .mapToDouble(CustomerOrder::getDeliveryLatitude)
                        .average().orElse(0);
                double avgLng = countyOrders.stream()
                        .mapToDouble(CustomerOrder::getDeliveryLongitude)
                        .average().orElse(0);
                data.put("latitude", avgLat);
                data.put("longitude", avgLng);
            }

            result.add(data);
        }

        result.sort((a, b) -> ((Long) b.get("orderCount")).compareTo((Long) a.get("orderCount")));

        return ResponseEntity.ok(result);
    }
}
