package com.cmms.controller;

import com.cmms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {
    private final UserRepository userRepository;

    @GetMapping("/api/auth/test-users")
    public long countUsers() {
        return userRepository.count();
    }
}
