#!/bin/bash

echo "=== FinJar Backend Start Script ==="

# Set Java environment
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Check if JAR exists
if [ ! -f "target/FinJar-0.0.1-SNAPSHOT.jar" ]; then
    echo "ERROR: JAR file not found!"
    ls -la target/
    exit 1
fi

echo "Starting Spring Boot application..."
echo "PORT: $PORT"
echo "SPRING_PROFILES_ACTIVE: prod"

# Start the application
java -Dserver.port=${PORT:-8080} \
     -Dspring.profiles.active=prod \
     -Xmx512m \
     -jar target/FinJar-0.0.1-SNAPSHOT.jar
