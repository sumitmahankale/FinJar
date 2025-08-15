package com.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/health")
@CrossOrigin(origins = "*")
public class HealthController {

    @GetMapping
    public String health() {
        return "Backend is working!";
    }

    @PostMapping
    public String healthPost() {
        return "POST working!";
    }
}
