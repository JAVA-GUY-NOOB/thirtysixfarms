package com.farmcity.config;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final String DEFAULT_SECRET = "defaultSecretKeyThatShouldBeChangedInProduction";
    private static final long DEFAULT_EXPIRATION_MILLIS = 86400000L;

    private final SecretKey secretKey;
    private final long expirationMillis;

    public JwtUtil(@Value("${jwt.secret:defaultSecretKeyThatShouldBeChangedInProduction}") String jwtSecret,
                   @Value("${jwt.expiration:86400000}") long expirationMillis) {
        String resolvedSecret = (jwtSecret == null || jwtSecret.isBlank()) ? DEFAULT_SECRET : jwtSecret;
        this.secretKey = Keys.hmacShaKeyFor(resolvedSecret.getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = expirationMillis > 0 ? expirationMillis : DEFAULT_EXPIRATION_MILLIS;
    }

    public static String generateToken(String username) {
        return new JwtUtil(resolveSecret(), resolveExpirationMillis()).generateTokenInternal(username);
    }

    public static String extractUsername(String token) {
        return new JwtUtil(resolveSecret(), resolveExpirationMillis()).extractUsernameInternal(token);
    }

    public static boolean validateToken(String token, String username) {
        JwtUtil jwtUtil = new JwtUtil(resolveSecret(), resolveExpirationMillis());
        String extractedUsername = jwtUtil.extractUsernameInternal(token);
        return extractedUsername.equals(username) && !jwtUtil.isTokenExpired(token);
    }

    private String generateTokenInternal(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMillis))
                .signWith(secretKey)
                .compact();
    }

    private String extractUsernameInternal(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
        return expiration.before(new Date());
    }

    private static String resolveSecret() {
        String envSecret = System.getenv("JWT_SECRET_KEY");
        return (envSecret == null || envSecret.isBlank()) ? DEFAULT_SECRET : envSecret;
    }

    private static long resolveExpirationMillis() {
        String value = System.getenv("JWT_EXPIRATION");
        if (value == null || value.isBlank()) {
            return DEFAULT_EXPIRATION_MILLIS;
        }
        try {
            return Long.parseLong(value);
        } catch (NumberFormatException ex) {
            return DEFAULT_EXPIRATION_MILLIS;
        }
    }
}
