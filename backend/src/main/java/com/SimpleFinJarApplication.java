package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Base64;
import java.nio.charset.StandardCharsets;

@SpringBootApplication
@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://finjar-chi.vercel.app", "https://finjar-frontend.vercel.app", "https://finjar.vercel.app"})
public class SimpleFinJarApplication {

    public static void main(String[] args) {
        SpringApplication.run(SimpleFinJarApplication.class, args);
    }

    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("FINJAR V4 FORCE DEPLOY - " + System.currentTimeMillis());
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("UP");
    }
    
    @GetMapping("/api/health")
    public ResponseEntity<Map<String, Object>> apiHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "FinJar API v3 is fully operational");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/api/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody(required = false) Map<String, Object> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
    String email = loginRequest != null && loginRequest.getOrDefault("email", null) instanceof String ?
        (String) loginRequest.get("email") : "john@example.com";
    String token = generateMockJwt(email, "John Doe");
    response.put("token", token);
        
        Map<String, Object> user = new HashMap<>();
        user.put("id", 1);
        user.put("email", "john@example.com");
        user.put("name", "John Doe");
        response.put("user", user);
        
        return ResponseEntity.ok(response);
    }

    // Alias endpoint without /api prefix (fallback for older frontend bundles)
    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> loginAlias(@RequestBody(required = false) Map<String, Object> loginRequest) {
        return login(loginRequest);
    }
    
    @PostMapping("/api/auth/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody(required = false) Map<String, Object> registerRequest) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Registration successful");
    String email = registerRequest != null && registerRequest.getOrDefault("email", null) instanceof String ?
        (String) registerRequest.get("email") : "newuser@example.com";
    String name = registerRequest != null && registerRequest.getOrDefault("name", null) instanceof String ?
        (String) registerRequest.get("name") : "New User";
    String token = generateMockJwt(email, name);
    response.put("token", token);
        
        Map<String, Object> user = new HashMap<>();
        user.put("id", 2);
        user.put("email", "newuser@example.com");
        user.put("name", "New User");
        response.put("user", user);
        
        return ResponseEntity.ok(response);
    }

    // Alias endpoint without /api prefix (fallback)
    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, Object>> registerAlias(@RequestBody(required = false) Map<String, Object> registerRequest) {
        return register(registerRequest);
    }

    // --- Helper to build a frontend-parseable mock JWT (header.payload.signature) ---
    private String generateMockJwt(String email, String name) {
        long nowSeconds = System.currentTimeMillis() / 1000L;
        long exp = nowSeconds + 3600; // 1h expiry
        String headerJson = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payloadJson = String.format("{\"sub\":\"%s\",\"name\":\"%s\",\"email\":\"%s\",\"iat\":%d,\"exp\":%d}",
                email, name.replace("\"", "'"), email, nowSeconds, exp);
        String header = base64Url(headerJson.getBytes(StandardCharsets.UTF_8));
        String payload = base64Url(payloadJson.getBytes(StandardCharsets.UTF_8));
        // Mock signature (not cryptographically valid)
        String signature = base64Url("mock-signature".getBytes(StandardCharsets.UTF_8));
        return header + "." + payload + "." + signature;
    }

    private String base64Url(byte[] input) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(input);
    }
    
    @GetMapping("/api/jars")
    public ResponseEntity<Map<String, Object>> getJars() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("jars", new Object[0]);
        response.put("message", "Jars endpoint working");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "TEST SUCCESSFUL - V3 WITH LOGIN");
        response.put("timestamp", System.currentTimeMillis());
        response.put("hasLogin", true);
        return ResponseEntity.ok(response);
    }
}
