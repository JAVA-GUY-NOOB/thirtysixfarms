package com.farmcity.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.farmcity.entity.UserAccount;
import com.farmcity.repository.UserAccountRepository;

@Configuration
public class AdminBootstrap {

    @Bean
    CommandLineRunner bootstrapAdmin(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder,
            Environment environment) {
        return args -> {
            boolean enabled = Boolean.parseBoolean(environment.getProperty("app.bootstrap-admin", "true"));
            String activeProfile = environment.getProperty("spring.profiles.active", "");

            if (!enabled || "prod".equalsIgnoreCase(activeProfile)) {
                return;
            }

            String username = environment.getProperty("app.admin.username", "admin");
            String email = environment.getProperty("app.admin.email", "admin@farmcity.local");
            String password = environment.getProperty("app.admin.password", "admin123");

            if (userAccountRepository.findByUsername(username).isPresent()
                    || userAccountRepository.findByEmail(email).isPresent()) {
                return;
            }

            UserAccount admin = new UserAccount();
            admin.setUsername(username);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setEmail(email);
            admin.setRole("ADMIN");
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setPhoneNumber("+254700000000");
            admin.setIsActive(true);

            userAccountRepository.save(admin);
        };
    }
}
