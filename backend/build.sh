#!/bin/bash

echo "=== FinJar Backend Build Script ==="

# Update package list and install Java 11
echo "Installing OpenJDK 11..."
apt-get update -qq
apt-get install -y openjdk-11-jdk-headless maven

# Find and set JAVA_HOME
export JAVA_HOME=$(readlink -f /usr/bin/java | sed "s:bin/java::")
echo "JAVA_HOME set to: $JAVA_HOME"

# Set PATH to include Java
export PATH=$JAVA_HOME/bin:$PATH

# Verify Java installation
echo "Java version:"
java -version
echo "Maven version:"
mvn -version

# Navigate to correct directory and list contents
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check if pom.xml exists
if [ ! -f "pom.xml" ]; then
    echo "ERROR: pom.xml not found in current directory!"
    echo "Available files:"
    ls -la
    exit 1
fi

# Make mvnw executable if it exists, otherwise use system maven
if [ -f "mvnw" ]; then
    echo "Using Maven wrapper..."
    chmod +x mvnw
    ./mvnw clean package -DskipTests -Dmaven.compiler.source=11 -Dmaven.compiler.target=11
else
    echo "Using system Maven..."
    mvn clean package -DskipTests -Dmaven.compiler.source=11 -Dmaven.compiler.target=11
fi

# Check build result
if [ -f "target/FinJar-0.0.1-SNAPSHOT.jar" ]; then
    echo "✅ Build completed successfully!"
    echo "JAR file details:"
    ls -la target/FinJar-0.0.1-SNAPSHOT.jar
else
    echo "❌ Build failed - JAR file not found!"
    echo "Target directory contents:"
    ls -la target/ || echo "Target directory does not exist"
    exit 1
fi
