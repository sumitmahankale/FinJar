package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FinJarApplication {

	public static void main(String[] args) {
		System.out.println("Starting FinJar Application...");
		System.out.println("PORT environment variable: " + System.getenv("PORT"));
		System.out.println("Spring profiles: " + System.getProperty("spring.profiles.active"));
		
		SpringApplication.run(FinJarApplication.class, args);
		
		System.out.println("FinJar Application started successfully!");
	}

}
