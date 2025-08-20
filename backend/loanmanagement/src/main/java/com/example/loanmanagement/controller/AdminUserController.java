package com.example.loanmanagement.controller;

import com.example.loanmanagement.model.User;
import com.example.loanmanagement.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping("/customers")
    public List<CustomerDto> customers() {
        return userRepository.findByRole(User.Role.CUSTOMER).stream()
                .map(u -> new CustomerDto(u.getId(), u.getName(), u.getEmail()))
                .toList();
    }

    @Data
    public static class CustomerDto {
        private final Long id;
        private final String name;
        private final String email;
    }
}
