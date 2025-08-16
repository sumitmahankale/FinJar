# Use Maven with OpenJDK 11 for building
FROM maven:3.8.4-openjdk-11-slim AS build

# Set working directory
WORKDIR /app

# Copy Maven configuration first (for better layer caching)
COPY pom.xml .

# Copy source code
COPY src src

# Build the application with minimal dependencies
RUN mvn clean package -DskipTests -B

# Use lightweight JRE for runtime
FROM openjdk:11-jre-slim

# Set working directory
WORKDIR /app

# Copy the jar file from build stage
COPY --from=build /app/target/FinJar-0.0.1-SNAPSHOT.jar app.jar

# Create startup script inline
RUN echo '#!/bin/bash' > start.sh && \
    echo 'echo "=== Starting FinJar ==="' >> start.sh && \
    echo 'echo "PORT: ${PORT:-8080}"' >> start.sh && \
    echo 'echo "Java Version:"' >> start.sh && \
    echo 'java -version' >> start.sh && \
    echo 'echo "Starting application..."' >> start.sh && \
    echo 'exec java -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -jar app.jar' >> start.sh && \
    chmod +x start.sh

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["./start.sh"]
