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

# Create startup script inline with extensive debugging
RUN echo '#!/bin/bash' > start.sh && \
    echo 'set -e' >> start.sh && \
    echo 'echo "=========================================="' >> start.sh && \
    echo 'echo "FINJAR CONTAINER STARTING"' >> start.sh && \
    echo 'echo "=========================================="' >> start.sh && \
    echo 'echo "Environment Variables:"' >> start.sh && \
    echo 'echo "PORT: ${PORT:-NOT_SET}"' >> start.sh && \
    echo 'echo "SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE:-NOT_SET}"' >> start.sh && \
    echo 'echo "Current directory: $(pwd)"' >> start.sh && \
    echo 'echo "Files in current directory:"' >> start.sh && \
    echo 'ls -la' >> start.sh && \
    echo 'echo "Java version:"' >> start.sh && \
    echo 'java -version' >> start.sh && \
    echo 'echo "=========================================="' >> start.sh && \
    echo 'echo "STARTING JAVA APPLICATION"' >> start.sh && \
    echo 'echo "=========================================="' >> start.sh && \
    echo 'exec java -Dserver.port=${PORT:-8080} -Dserver.address=0.0.0.0 -jar app.jar' >> start.sh && \
    chmod +x start.sh

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["./start.sh"]
