package com.opportunet.opportunet_backend.Config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordVerifier {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String storedHash = "$2a$10$1CQV8B5kLw..."; // 🔥 Mets ici le hash exact récupéré en base
        String enteredPassword = "test"; // 🔥 Mets ici le mot de passe que tu utilises

        if (encoder.matches(enteredPassword, storedHash)) {
            System.out.println("✅ Le mot de passe est correct !");
        } else {
            System.out.println("❌ Mot de passe incorrect !");
        }
    }
}