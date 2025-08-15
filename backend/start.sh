#!/bin/bash

echo "=== FinJar Backend Start Script ==="

# Set up Java environment
export JAVA_HOME=$(readlink -f /usr/bin/java | sed "s:bin/java::")
export PATH=$JAVA_HOME/bin:$PATH

echo "JAVA_HOME: $JAVA_HOME"
echo "Java version:"
java -version

# Check if JAR exists
JAR_FILE="target/FinJar-0.0.1-SNAPSHOT.jar"
if [ ! -f "$JAR_FILE" ]; then
    echo "ERROR: JAR file not found at $JAR_FILE"
    echo "Current directory: $(pwd)"
    echo "Directory contents:"
    ls -la
    echo "Target directory contents:"
    ls -la target/ || echo "Target directory does not exist"
    exit 1
fi

echo "✅ JAR file found: $JAR_FILE"
echo "JAR file size: $(ls -lh $JAR_FILE | awk '{print $5}')"

echo "Starting Spring Boot application..."
echo "PORT: ${PORT:-8080}"
echo "SPRING_PROFILES_ACTIVE: prod"

# Start the application with proper memory settings for Render
exec java -Dserver.port=${PORT:-8080} \
          -Dspring.profiles.active=prod \
          -Xmx512m -Xms256m \
          -XX:+UseG1GC \
          -XX:MaxGCPauseMillis=200 \
          -jar "$JAR_FILE"
