package com.example.loanmanagement.repository;

import com.example.loanmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // NEW: list users by role
    List<User> findByRole(User.Role role);
}
