package com.example.loanmanagement.controller;

import com.example.loanmanagement.dto.AuthResponse;
import com.example.loanmanagement.dto.LoginRequest;
import com.example.loanmanagement.dto.RegisterRequest;
import com.example.loanmanagement.model.User;
import com.example.loanmanagement.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request); // still does the saving logic
        return ResponseEntity.ok("User is registered");
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
