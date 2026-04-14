package com.farmcity.config;

import java.util.Date;
import javax.crypto.SecretKey;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtUtil {

    public JwtUtil() {
        // Constructor is intentionally left empty as this class only provides static utility methods.
        throw new UnsupportedOperationException("JwtUtil is a utility class and should not be instantiated.");
    }

    @Override
    public String toString() {
        return "JwtUtil []";
    }
    // JWT utility methods go here
    private static final String SECRET_KEY_STRING = System.getenv("JWT_SECRET_KEY");
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET_KEY_STRING.getBytes());

    public static String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(SECRET_KEY)
                .compact();
    }

    public static String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public static boolean validateToken(String token, String username) {
        String extractedUsername = extractUsername(token);
        return extractedUsername.equals(username) && !isTokenExpired(token);
    }

    private static boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
        return expiration.before(new Date());
    }
}
