#!/bin/bash

echo "=== Simple Maven Build Script ==="

# Install Java and Maven
echo "Installing Java 11 and Maven..."
apt-get update -qq
apt-get install -y openjdk-11-jdk maven

# Set Java environment
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Verify installations
echo "Java version:"
java -version
echo "Maven version:"
mvn -version

# Build with system Maven (skip wrapper entirely)
echo "Building with system Maven..."
mvn clean package -DskipTests

# Check result
if [ -f "target/FinJar-0.0.1-SNAPSHOT.jar" ]; then
    echo "✅ Build successful!"
    ls -la target/FinJar-0.0.1-SNAPSHOT.jar
else
    echo "❌ Build failed!"
    ls -la target/ || echo "No target directory"
    exit 1
fi
