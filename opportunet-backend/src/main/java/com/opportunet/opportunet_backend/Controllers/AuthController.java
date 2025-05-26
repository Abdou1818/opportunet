package com.opportunet.opportunet_backend.Controllers;

import com.opportunet.opportunet_backend.Services.JwtService;
import com.opportunet.opportunet_backend.Repositories.JobSeekerRepository;
import com.opportunet.opportunet_backend.Entities.JobSeeker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    private JobSeekerRepository jobSeekerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Inscription d'un utilisateur avec hachage sécurisé du mot de passe
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody JobSeeker jobSeeker) {
        logger.info("Tentative d'inscription pour l'email: {}", jobSeeker.getEmail());

        // Vérifier si l'utilisateur existe déjà
        if (jobSeekerRepository.findByEmail(jobSeeker.getEmail()).isPresent()) {
            logger.warn("Échec de l'inscription: Email déjà utilisé {}", jobSeeker.getEmail());
            return ResponseEntity.status(400).body("Email déjà utilisé !");
        }

        // Hachage du mot de passe
        String hashedPassword = passwordEncoder.encode(jobSeeker.getPassword());
        jobSeeker.setPassword(hashedPassword);

        // Sauvegarde dans la base de données
        jobSeekerRepository.save(jobSeeker);

        logger.info("Utilisateur inscrit avec succès: {}", jobSeeker.getEmail());
        return ResponseEntity.ok("Inscription réussie !");
    }

    /**
     * Connexion de l'utilisateur avec vérification du mot de passe haché
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        logger.info("Tentative de connexion avec email: {}", email);

        Optional<JobSeeker> user = jobSeekerRepository.findByEmail(email);

        if (user.isPresent()) {
            logger.info("Utilisateur trouvé: {}", user.get().getEmail());
            logger.info("Mot de passe saisi: {}", password);
            logger.info("Mot de passe en base (hashé): {}", user.get().getPassword());

            // Vérification du mot de passe haché
            if (passwordEncoder.matches(password, user.get().getPassword())) {
                String token = jwtService.generateToken(email);
                logger.info("Authentification réussie, token généré");
                return ResponseEntity.ok(token);
            } else {
                logger.warn("Le mot de passe ne correspond pas !");
            }
        } else {
            logger.warn("Utilisateur non trouvé avec cet email: {}", email);
        }

        return ResponseEntity.status(401).body("Identifiants erronés");
    }
}