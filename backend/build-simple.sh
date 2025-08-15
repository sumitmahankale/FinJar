#!/bin/bash

echo "=== Ultra Simple Build Script ==="

# Install packages
echo "Installing Java 11 and Maven..."
apt-get update -qq
apt-get install -y openjdk-11-jdk maven

# Wait a moment for installation
sleep 3

# Find Java and set environment
echo "Setting up Java environment..."
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export PATH=$JAVA_HOME/bin:/usr/bin:$PATH

# Direct paths to avoid PATH issues
JAVA_CMD="$JAVA_HOME/bin/java"
MAVEN_CMD="/usr/bin/mvn"

# Test installations with direct paths
echo "Testing Java:"
$JAVA_CMD -version

echo "Testing Maven:"
$MAVEN_CMD -version

# Build using direct Maven path
echo "Building application..."
$MAVEN_CMD clean package -DskipTests \
    -Dmaven.compiler.source=11 \
    -Dmaven.compiler.target=11 \
    -Djava.home=$JAVA_HOME

# Check result
if [ -f "target/FinJar-0.0.1-SNAPSHOT.jar" ]; then
    echo "✅ SUCCESS! JAR file created:"
    ls -la target/FinJar-0.0.1-SNAPSHOT.jar
else
    echo "❌ FAILED! No JAR file found."
    echo "Target directory:"
    ls -la target/ || echo "Target directory missing"
    exit 1
fi
