package com.cmms.controller;

import com.cmms.dto.LoginRequest;
import com.cmms.dto.RegisterRequest;
import com.cmms.model.User;
import com.cmms.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        User user = User.builder()
                .username("admin_test")
                .email("admin@test.com")
                .password(passwordEncoder.encode("password123"))
                .fullName("Admin Test")
                .role(User.Role.ADMIN)
                .build();
        userRepository.save(user);
    }

    @Test
    void registerUser_ReturnsOk() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("new_tech");
        request.setEmail("tech@test.com");
        request.setPassword("password123");
        request.setFullName("New Tech");
        request.setRole(User.Role.TECHNICIAN);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));
    }

    @Test
    void loginUser_ReturnsTokens() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("admin_test");
        request.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.refreshToken").exists())
                .andExpect(jsonPath("$.username").value("admin_test"));
    }
}
