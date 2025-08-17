package com.service;

import com.model.UserEntity;
import com.repo.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepo userRepo;
    public AuthService(UserRepo userRepo) { this.userRepo = userRepo; }

    private String hash(String raw) { return Integer.toHexString((raw == null ? "" : raw).hashCode()); }

    @Transactional
    public UserEntity register(String email, String name, String password) {
        if (userRepo.existsByEmail(email.toLowerCase())) throw new IllegalArgumentException("Email already registered");
        UserEntity u = new UserEntity();
        u.setEmail(email.toLowerCase());
        u.setName(name);
        u.setPasswordHash(hash(password));
        return userRepo.save(u);
    }

    public UserEntity authenticate(String email, String password) {
        return userRepo.findByEmail(email.toLowerCase())
                .filter(u -> u.getPasswordHash().equals(hash(password)))
                .orElse(null);
    }
}
