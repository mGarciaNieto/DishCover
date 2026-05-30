package com.dishcover.backend.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.dishcover.backend.dto.response.ValidationResponse;
import com.dishcover.backend.models.UserModel;
import com.dishcover.backend.repositories.IUserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class JwtService {

    @Autowired
    private IUserRepository userRepository;

    @Value("${app.jwt.secret:dishcover-academic-development-secret-key-2026-manuel-garcia-nieto}")
    private String secret;

    @Value("${app.jwt.expiration-ms:36000000}")
    private long expirationTime;

    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    public Boolean validateToken(String token, String username) {
        try {
            String extractedUsername = extractUsername(token);
            return (extractedUsername.equals(username) && !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getTokenFromRequest(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith("Bearer ")){
            return headerAuth.substring(7, headerAuth.length());
        }
        return null;

    }

    public ValidationResponse validateTokenAndUser(HttpServletRequest header) {
        String token = getTokenFromRequest(header);
        if (token == null) {
            return new ValidationResponse(null, false);
        }

        try {
            String username = extractUsername(token);
            UserModel user = userRepository.findByUsername(username).orElse(null);
            if (user == null) {
                return new ValidationResponse(username, false);
            }
            boolean isValid = validateToken(token, user.getUsername());
            return new ValidationResponse(username, isValid);
        } catch (JwtException | IllegalArgumentException e) {
            return new ValidationResponse(null, false);
        }
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
