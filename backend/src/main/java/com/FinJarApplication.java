package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class, 
    HibernateJpaAutoConfiguration.class
})
public class FinJarApplication {

	public static void main(String[] args) {
		System.out.println("Starting FinJar Application...");
		System.out.println("PORT environment variable: " + System.getenv("PORT"));
		System.out.println("Spring profiles: " + System.getProperty("spring.profiles.active"));
		
		try {
			SpringApplication.run(FinJarApplication.class, args);
			System.out.println("FinJar Application started successfully!");
		} catch (Exception e) {
			System.err.println("Failed to start application: " + e.getMessage());
			e.printStackTrace();
		}
	}

}
