package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
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

    // Basic endpoints
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
    
    // API endpoints for frontend compatibility
    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> apiHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "FinJar API is fully operational");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/api/status")
    public ResponseEntity<Map<String, Object>> apiStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "FinJar API with endpoints ready");
        response.put("version", "0.0.1-SNAPSHOT");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    // Auth endpoints
    @GetMapping("/api/auth/status")
    public ResponseEntity<Map<String, Object>> authStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Auth system ready");
        response.put("authenticated", false);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/api/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody(required = false) Map<String, Object> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", "mock-jwt-token-12345");
        
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1);
        user.put("email", "john@example.com");
        user.put("name", "John Doe");
        user.put("createdAt", System.currentTimeMillis());
        response.put("user", user);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/api/auth/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody(required = false) Map<String, Object> registerRequest) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Registration successful");
        response.put("token", "mock-jwt-token-67890");
        
        Map<String, Object> user = new HashMap<>();
        user.put("id", 2);
        user.put("email", "newuser@example.com");
        user.put("name", "New User");
        user.put("createdAt", System.currentTimeMillis());
        response.put("user", user);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/api/jars")
    public ResponseEntity<Map<String, Object>> getJars() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("jars", new Object[0]); // Empty array for now
        response.put("message", "Jars endpoint working - returning empty list");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "TEST SUCCESSFUL - SIMPLE API v2");
        response.put("timestamp", System.currentTimeMillis());
        response.put("port", System.getProperty("server.port", "UNKNOWN"));
        response.put("javaVersion", System.getProperty("java.version"));
        response.put("env_port", System.getenv("PORT"));
        response.put("cors_enabled", true);
        return ResponseEntity.ok(response);
    }
}
