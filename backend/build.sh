#!/bin/bash

echo "=== FinJar Backend Build Script ==="

# Install Java 11 first
echo "Installing OpenJDK 11..."
apt-get update -qq
apt-get install -y openjdk-11-jdk-headless

# Find and set JAVA_HOME properly
export JAVA_HOME=$(find /usr/lib/jvm -name "java-11-openjdk*" -type d | head -1)
if [ -z "$JAVA_HOME" ]; then
    export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
fi

echo "JAVA_HOME set to: $JAVA_HOME"
export PATH=$JAVA_HOME/bin:$PATH

# Verify Java installation
echo "Verifying Java installation:"
which java
java -version

# Install Maven as backup
echo "Installing Maven..."
apt-get install -y maven

# Navigate to correct directory and list contents
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check if pom.xml exists
if [ ! -f "pom.xml" ]; then
    echo "ERROR: pom.xml not found in current directory!"
    exit 1
fi

# Set JAVA_HOME in mvnw file if it exists
if [ -f "mvnw" ]; then
    echo "Preparing Maven wrapper with correct JAVA_HOME..."
    chmod +x mvnw
    
    # Set JAVA_HOME explicitly for mvnw
    sed -i "1i export JAVA_HOME=$JAVA_HOME" mvnw
    
    echo "Building with Maven wrapper..."
    export MAVEN_OPTS="-Xmx1024m"
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
    echo "Checking what went wrong..."
    if [ -d "target" ]; then
        echo "Target directory contents:"
        ls -la target/
    else
        echo "Target directory does not exist - Maven build completely failed"
    fi
    
    # Show Maven/Java debugging info
    echo "=== Debug Information ==="
    echo "JAVA_HOME: $JAVA_HOME"
    echo "PATH: $PATH"
    echo "Java location: $(which java)"
    echo "Maven location: $(which mvn)"
    
    exit 1
fi
