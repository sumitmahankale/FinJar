#!/bin/bash

echo "=== Environment Test and Build ==="

# Install essentials
apt-get update
apt-get install -y openjdk-11-jdk maven curl

# Test environment
echo "=== Environment Check ==="
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME)"
echo "User: $(whoami)"
echo "Working directory: $(pwd)"
echo "Available space: $(df -h . | tail -1)"

# Find Java
JAVA_HOME=$(find /usr -name "java-11*" -type d 2>/dev/null | grep jvm | head -1)
if [ -z "$JAVA_HOME" ]; then
    JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"
fi

echo "JAVA_HOME: $JAVA_HOME"

# Test Java directly
if [ -f "$JAVA_HOME/bin/java" ]; then
    echo "✅ Java found at: $JAVA_HOME/bin/java"
    $JAVA_HOME/bin/java -version
else
    echo "❌ Java not found at expected location"
    echo "Searching for Java..."
    find /usr -name "java" -type f 2>/dev/null | head -5
fi

# Test Maven directly
if [ -f "/usr/bin/mvn" ]; then
    echo "✅ Maven found at: /usr/bin/mvn"
    /usr/bin/mvn -version
else
    echo "❌ Maven not found"
fi

# Check project structure
echo "=== Project Check ==="
echo "Files in current directory:"
ls -la
echo "pom.xml exists: $([ -f pom.xml ] && echo "YES" || echo "NO")"

# Simple build attempt
echo "=== Build Attempt ==="
/usr/bin/mvn clean compile

echo "=== Result ==="
echo "Target directory created: $([ -d target ] && echo "YES" || echo "NO")"
if [ -d "target" ]; then
    echo "Target contents:"
    ls -la target/
fi
