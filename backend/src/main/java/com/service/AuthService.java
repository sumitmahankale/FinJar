package com.service;

import com.model.UserEntity;
import com.repo.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class AuthService {
    private final UserRepo userRepo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    public AuthService(UserRepo userRepo) { this.userRepo = userRepo; }

    // Legacy simple hash (for existing seeded users) – keep for fallback validation
    private String legacyHash(String raw) { return Integer.toHexString((raw == null ? "" : raw).hashCode()); }
    private boolean isLegacy(String stored) { return stored != null && !stored.startsWith("$2a$") && !stored.startsWith("$2b$") && !stored.startsWith("$2y$"); }

    @Transactional
    public UserEntity register(String email, String name, String password) {
        if (userRepo.existsByEmail(email.toLowerCase())) throw new IllegalArgumentException("Email already registered");
        UserEntity u = new UserEntity();
        u.setEmail(email.toLowerCase());
        u.setName(name);
        u.setPasswordHash(encoder.encode(password));
        return userRepo.save(u);
    }

    public UserEntity authenticate(String email, String password) {
        return userRepo.findByEmail(email.toLowerCase()).map(u -> {
            String stored = u.getPasswordHash();
            boolean matches;
            if (isLegacy(stored)) {
                matches = stored.equals(legacyHash(password));
                if (matches) { // upgrade transparently
                    u.setPasswordHash(encoder.encode(password));
                    userRepo.save(u);
                }
            } else {
                matches = encoder.matches(password, stored);
            }
            return matches ? u : null;
        }).orElse(null);
    }
}
