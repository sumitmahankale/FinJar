package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://finjar-chi.vercel.app", "https://finjar-frontend.vercel.app"})
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
    public ResponseEntity<Object> apiHealth() {
        return ResponseEntity.ok(new Object() {
            public final String status = "UP";
            public final String message = "FinJar API is running";
            public final long timestamp = System.currentTimeMillis();
        });
    }
    
    @GetMapping("/api/status")
    public ResponseEntity<Object> apiStatus() {
        return ResponseEntity.ok(new Object() {
            public final String status = "SUCCESS";
            public final String message = "Backend is ready for frontend integration";
            public final String version = "0.0.1-SNAPSHOT";
            public final long timestamp = System.currentTimeMillis();
        });
    }
    
    // Placeholder endpoints that frontend might call
    @GetMapping("/api/auth/status")
    public ResponseEntity<Object> authStatus() {
        return ResponseEntity.ok(new Object() {
            public final String message = "Auth endpoints coming soon";
            public final boolean authenticated = false;
        });
    }
    
    @GetMapping("/api/jars")
    public ResponseEntity<Object> getJars() {
        return ResponseEntity.ok(new Object() {
            public final String message = "Jar endpoints coming soon";
            public final Object[] jars = new Object[0];
        });
    }
    
    @GetMapping("/test")
    public ResponseEntity<Object> test() {
        return ResponseEntity.ok(new Object() {
            public final String message = "TEST SUCCESSFUL";
            public final long timestamp = System.currentTimeMillis();
            public final String port = System.getProperty("server.port", "UNKNOWN");
            public final String javaVersion = System.getProperty("java.version");
            public final String env_port = System.getenv("PORT");
            public final boolean cors_enabled = true;
        });
    }
}
