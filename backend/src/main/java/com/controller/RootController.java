package com.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://finjar-chi.vercel.app", "https://finjar-frontend.vercel.app"})
public class RootController {

    @GetMapping("/")
    public String root() {
        return "FinJar Backend is running successfully!";
    }
    
    @GetMapping("/status")
    public String status() {
        return "Backend Status: OK";
    }
}
