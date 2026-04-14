package com.farmcity.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmcity.entity.UserAccount;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByUsername(String username);
    Optional<UserAccount> findByEmail(String email);
    long countByRole(String role);
    long countByIsActive(Boolean isActive);
}
