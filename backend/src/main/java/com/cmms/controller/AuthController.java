package com.cmms.controller;

import com.cmms.dto.JwtResponse;
import com.cmms.dto.LoginRequest;
import com.cmms.dto.RegisterRequest;
import com.cmms.model.User;
import com.cmms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        User user = authService.registerUser(signUpRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully with username: " + user.getUsername() + ". Please check your email to verify your account.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam("token") String token) {
        Map<String, String> response = new HashMap<>();
        try {
            boolean isVerified = authService.verifyEmail(token);
            if (isVerified) {
                response.put("message", "Email verified successfully. You can now login.");
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Verification failed.");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
