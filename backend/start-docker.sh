#!/bin/bash

echo "=== FinJar Startup Script ==="
echo "PORT: ${PORT:-8080}"
echo "SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE:-prod}"

# Set environment variables
export SERVER_PORT=${PORT:-8080}
export SPRING_PROFILES_ACTIVE=${SPRING_PROFILES_ACTIVE:-prod}

echo "SERVER_PORT: $SERVER_PORT"
echo "Starting application on all interfaces (0.0.0.0:$SERVER_PORT)"

# Check if JAR file exists
if [ ! -f "app.jar" ]; then
    echo "ERROR: JAR file not found at app.jar"
    ls -la
    exit 1
fi

# Start the application with explicit server configuration
exec java -Dserver.port=$SERVER_PORT \
          -Dserver.address=0.0.0.0 \
          -Dspring.profiles.active=$SPRING_PROFILES_ACTIVE \
          -Xmx512m -Xms256m \
          -XX:+UseG1GC \
          -XX:MaxGCPauseMillis=200 \
          -Djava.security.egd=file:/dev/./urandom \
          -jar app.jar
