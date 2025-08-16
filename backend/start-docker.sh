#!/bin/bash

echo "=== FinJar Startup Script ==="
echo "PORT: ${PORT:-8080}"
echo "SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE:-prod}"
echo "Java Version:"
java -version

# Check if JAR file exists
if [ ! -f "app.jar" ]; then
    echo "ERROR: JAR file not found at app.jar"
    ls -la
    exit 1
fi

echo "Starting application..."

# Start the application with proper port configuration
exec java -Dserver.port=${PORT:-8080} \
          -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod} \
          -Xmx512m -Xms256m \
          -XX:+UseG1GC \
          -XX:MaxGCPauseMillis=200 \
          -Djava.security.egd=file:/dev/./urandom \
          -jar app.jar
