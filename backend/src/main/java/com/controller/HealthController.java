package com.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://finjar-chi.vercel.app"})
public class HealthController {

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
            public final String address = System.getProperty("server.address", "0.0.0.0");
        };
    }
}
