package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class SimpleFinJarApplication {

    public static void main(String[] args) {
        System.out.println("=== Starting Simple FinJar Application ===");
        System.out.println("PORT: " + System.getenv("PORT"));
        System.out.println("Java Version: " + System.getProperty("java.version"));
        
        SpringApplication.run(SimpleFinJarApplication.class, args);
        
        System.out.println("=== Application Started Successfully ===");
    }

    @GetMapping("/")
    public String home() {
        return "FinJar Backend is running successfully!";
    }
    
    @GetMapping("/health")
    public String health() {
        return "OK";
    }
    
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
    
    @GetMapping("/status")
    public Object status() {
        return new Object() {
            public final String status = "UP";
            public final String application = "FinJar Backend";
            public final long timestamp = System.currentTimeMillis();
            public final String port = System.getProperty("server.port", "8080");
            public final String javaVersion = System.getProperty("java.version");
        };
    }
}
