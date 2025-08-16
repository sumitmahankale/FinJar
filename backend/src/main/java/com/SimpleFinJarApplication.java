package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
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
    
    @GetMapping("/test")
    public ResponseEntity<Object> test() {
        return ResponseEntity.ok(new Object() {
            public final String message = "TEST SUCCESSFUL";
            public final long timestamp = System.currentTimeMillis();
            public final String port = System.getProperty("server.port", "UNKNOWN");
            public final String javaVersion = System.getProperty("java.version");
            public final String env_port = System.getenv("PORT");
        });
    }
}
