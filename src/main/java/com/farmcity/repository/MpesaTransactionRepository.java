package com.farmcity.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmcity.entity.MpesaTransaction;

public interface MpesaTransactionRepository extends JpaRepository<MpesaTransaction, Long> {
    Optional<MpesaTransaction> findByCheckoutRequestId(String checkoutRequestId);
}
