package com.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Configure CORS for API endpoints
        registry.addMapping("/api/**")
            .allowedOrigins(
                "http://localhost:5173",
                "https://finjar-chi.vercel.app",
                "https://finjar-frontend.vercel.app",
                "https://*.vercel.app"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
            
        // Configure CORS for auth endpoints
        registry.addMapping("/auth/**")
            .allowedOrigins(
                "http://localhost:5173",
                "https://finjar-chi.vercel.app",
                "https://finjar-frontend.vercel.app",
                "https://*.vercel.app"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
