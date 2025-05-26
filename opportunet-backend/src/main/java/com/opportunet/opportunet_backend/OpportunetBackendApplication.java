package com.opportunet.opportunet_backend; // ✅ Doit être dans ce package

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.opportunet.opportunet_backend") // ✅ Vérifie que c'est correct
@EnableJpaRepositories(basePackages = "com.opportunet.opportunet_backend.Repositories")
public class OpportunetBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(OpportunetBackendApplication.class, args);
	}
}