# Use Maven with OpenJDK 11 for building
FROM maven:3.8.4-openjdk-11-slim AS build

# Set working directory
WORKDIR /app

# Copy Maven configuration first (for better layer caching)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Download dependencies first (better layer caching)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src src

# Build the application with detailed logging
RUN mvn clean package -DskipTests -B

# Use lightweight JRE for runtime
FROM openjdk:11-jre-slim

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the jar file from build stage
COPY --from=build /app/target/FinJar-0.0.1-SNAPSHOT.jar app.jar

# Copy startup script
COPY start-docker.sh start.sh
RUN chmod +x start.sh

# Create a non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring
RUN chown spring:spring app.jar start.sh
USER spring

# Expose port
EXPOSE 8080

# Set environment variable for production
ENV SPRING_PROFILES_ACTIVE=prod

# Health check (disabled for now as PORT is dynamic)
# HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
#   CMD curl -f http://localhost:${PORT:-8080}/health || exit 1

# Run the application with startup script
ENTRYPOINT ["./start.sh"]
