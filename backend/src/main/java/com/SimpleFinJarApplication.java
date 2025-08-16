package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootApplication
@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://finjar-chi.vercel.app", "https://finjar-frontend.vercel.app", "https://finjar.vercel.app"})
public class SimpleFinJarApplication {

    public static void main(String[] args) {
        System.out.println("=== FINJAR STARTING ===");
        System.out.println("PORT: " + System.getenv("PORT"));
        System.out.println("JAVA VERSION: " + System.getProperty("java.version"));
        System.out.println("WORKING DIR: " + System.getProperty("user.dir"));
        
        try {
            ConfigurableApplicationContext context = SpringApplication.run(SimpleFinJarApplication.class, args);
            System.out.println("=== APPLICATION STARTED SUCCESSFULLY ===");
            System.out.println("Active profiles: " + String.join(",", context.getEnvironment().getActiveProfiles()));
            System.out.println("Server port: " + context.getEnvironment().getProperty("server.port"));
        } catch (Exception e) {
            System.err.println("=== STARTUP FAILED ===");
            e.printStackTrace();
            System.exit(1);
        }
    }

    // ================== BASIC ENDPOINTS ==================
    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("FINJAR IS ALIVE!");
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("UP");
    }
    
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("PONG");
    }

    // ================== API HEALTH ENDPOINTS ==================
    @GetMapping("/api/health")
    public ResponseEntity<Object> apiHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "FinJar API is fully operational");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/api/status")
    public ResponseEntity<Object> apiStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "FinJar API is fully operational");
        response.put("version", "0.0.1-SNAPSHOT");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    // ================== AUTH ENDPOINTS ==================
    @GetMapping("/api/auth/status")
    public ResponseEntity<Object> authStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Auth system operational");
        response.put("authenticated", false);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/api/auth/login")
    public ResponseEntity<Object> login(@RequestBody(required = false) Map<String, Object> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful (mock)");
        response.put("token", "mock-jwt-token-12345");
        response.put("user", createMockUser("john@example.com", "John Doe"));
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/api/auth/register")
    public ResponseEntity<Object> register(@RequestBody(required = false) Map<String, Object> registerRequest) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Registration successful (mock)");
        response.put("token", "mock-jwt-token-67890");
        response.put("user", createMockUser("newuser@example.com", "New User"));
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/api/auth/logout")
    public ResponseEntity<Object> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }

    // ================== USER ENDPOINTS ==================
    @GetMapping("/api/user/profile")
    public ResponseEntity<Object> getUserProfile() {
        return ResponseEntity.ok(createMockUser("john@example.com", "John Doe"));
    }
    
    @PutMapping("/api/user/update")
    public ResponseEntity<Object> updateUserProfile(@RequestBody(required = false) Map<String, Object> userData) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Profile updated successfully");
        response.put("user", createMockUser("john@example.com", "John Doe Updated"));
        return ResponseEntity.ok(response);
    }

    // ================== JAR ENDPOINTS ==================
    @GetMapping("/api/jars")
    public ResponseEntity<Object> getJars() {
        List<Map<String, Object>> jars = new ArrayList<>();
        jars.add(createMockJar(1L, "Emergency Fund", 1000.0, 500.0, "Save for emergencies"));
        jars.add(createMockJar(2L, "Vacation Fund", 2000.0, 750.0, "Trip to Europe"));
        jars.add(createMockJar(3L, "New Car", 15000.0, 3000.0, "Down payment for car"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("jars", jars);
        response.put("total", jars.size());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/api/jars")
    public ResponseEntity<Object> createJar(@RequestBody(required = false) Map<String, Object> jarData) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Jar created successfully");
        response.put("jar", createMockJar(4L, "New Jar", 1000.0, 0.0, "New jar description"));
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/api/jars/{id}")
    public ResponseEntity<Object> updateJar(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> jarData) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Jar updated successfully");
        response.put("jar", createMockJar(id, "Updated Jar", 1500.0, 200.0, "Updated description"));
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/api/jars/{id}")
    public ResponseEntity<Object> deleteJar(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Jar deleted successfully");
        return ResponseEntity.ok(response);
    }

    // ================== DEPOSIT ENDPOINTS ==================
    @GetMapping("/api/deposits")
    public ResponseEntity<Object> getDeposits(@RequestParam(required = false) Long jarId) {
        List<Map<String, Object>> deposits = new ArrayList<>();
        deposits.add(createMockDeposit(1L, jarId != null ? jarId : 1L, 100.0, "Initial deposit"));
        deposits.add(createMockDeposit(2L, jarId != null ? jarId : 1L, 50.0, "Weekly savings"));
        deposits.add(createMockDeposit(3L, jarId != null ? jarId : 1L, 75.0, "Extra savings"));
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("deposits", deposits);
        response.put("total", deposits.size());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/api/deposits")
    public ResponseEntity<Object> createDeposit(@RequestBody(required = false) Map<String, Object> depositData) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Deposit created successfully");
        response.put("deposit", createMockDeposit(4L, 1L, 200.0, "New deposit"));
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/api/deposits/{id}")
    public ResponseEntity<Object> updateDeposit(@PathVariable Long id, @RequestBody(required = false) Map<String, Object> depositData) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Deposit updated successfully");
        response.put("deposit", createMockDeposit(id, 1L, 250.0, "Updated deposit"));
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/api/deposits/{id}")
    public ResponseEntity<Object> deleteDeposit(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Deposit deleted successfully");
        return ResponseEntity.ok(response);
    }

    // ================== HELPER METHODS ==================
    private Map<String, Object> createMockUser(String email, String name) {
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1L);
        user.put("email", email);
        user.put("name", name);
        user.put("createdAt", System.currentTimeMillis());
        return user;
    }
    
    private Map<String, Object> createMockJar(Long id, String name, Double target, Double current, String description) {
        Map<String, Object> jar = new HashMap<>();
        jar.put("id", id);
        jar.put("name", name);
        jar.put("targetAmount", target);
        jar.put("currentAmount", current);
        jar.put("description", description);
        jar.put("progress", current / target * 100);
        jar.put("createdAt", System.currentTimeMillis());
        return jar;
    }
    
    private Map<String, Object> createMockDeposit(Long id, Long jarId, Double amount, String description) {
        Map<String, Object> deposit = new HashMap<>();
        deposit.put("id", id);
        deposit.put("jarId", jarId);
        deposit.put("amount", amount);
        deposit.put("description", description);
        deposit.put("createdAt", System.currentTimeMillis());
        return deposit;
    }
}
