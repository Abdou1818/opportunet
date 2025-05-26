package com.opportunet.opportunet_backend.Services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private static final String SECRET_KEY = "ePJAQnI9EferQ+ygncTRzdXanNDwx0WhWvPd5Zv/yGk="; // Mets une clé forte ici

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 heures
                .signWith(getSigningKey()) // ✅ Nouvelle syntaxe
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // ✅ Nouvelle syntaxe
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}