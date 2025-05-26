package com.opportunet.opportunet_backend.Controllers;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/error")
public class CustomErrorController implements ErrorController {

    @GetMapping
    public ResponseEntity<String> handleError() {
        return ResponseEntity.badRequest().body("Une erreur est survenue !");
    }
}