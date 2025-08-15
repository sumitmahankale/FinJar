#!/bin/bash

echo "=== FinJar Backend Build Script ==="

# Set up environment
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Install OpenJDK 11 if not available
if ! command -v java &> /dev/null; then
    echo "Installing OpenJDK 11..."
    apt-get update
    apt-get install -y openjdk-11-jdk
fi

# Display Java version
echo "Java version:"
java -version

# Navigate to correct directory and build
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Make mvnw executable and build
chmod +x mvnw
echo "Building Spring Boot application..."
./mvnw clean package -DskipTests

echo "Build completed! JAR file:"
ls -la target/FinJar-0.0.1-SNAPSHOT.jar
