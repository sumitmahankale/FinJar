# Use Maven with OpenJDK 11 for building
FROM maven:3.8.4-openjdk-11-slim AS build

# Set working directory
WORKDIR /app

# Copy Maven configuration first (for better layer caching)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Copy source code
COPY src src

# Build the application
RUN mvn clean package -DskipTests

# Use lightweight JRE for runtime
FROM openjdk:11-jre-slim

# Set working directory
WORKDIR /app

# Copy the jar file from build stage
COPY --from=build /app/target/FinJar-0.0.1-SNAPSHOT.jar app.jar

# Create a non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring
RUN chown spring:spring app.jar
USER spring

# Expose port
EXPOSE 8080

# Set environment variable for production
ENV SPRING_PROFILES_ACTIVE=prod

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
