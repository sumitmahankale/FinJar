package com.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS configuration moved to SecurityConfig.java to avoid conflicts
    // No additional configuration needed here
}
