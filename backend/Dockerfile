FROM openjdk:11-jre-slim

# Set working directory
WORKDIR /app

# Copy the jar file
COPY target/FinJar-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variable for production
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
