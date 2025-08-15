#!/bin/bash

echo "=== FinJar Backend Build Script ==="

# Update package manager and install Java 11
echo "Updating package manager..."
apt-get update -qq

echo "Installing OpenJDK 11 and Maven..."
apt-get install -y openjdk-11-jdk openjdk-11-jre maven

# Wait for installation to complete
sleep 2

# Find Java installation
JAVA_LOCATIONS=(
    "/usr/lib/jvm/java-11-openjdk-amd64"
    "/usr/lib/jvm/java-11-openjdk"
    "/usr/lib/jvm/java-1.11.0-openjdk-amd64"
    "/usr/lib/jvm/default-java"
)

for location in "${JAVA_LOCATIONS[@]}"; do
    if [ -d "$location" ]; then
        export JAVA_HOME="$location"
        break
    fi
done

# If still not found, try to find it
if [ -z "$JAVA_HOME" ] || [ ! -d "$JAVA_HOME" ]; then
    export JAVA_HOME=$(find /usr/lib/jvm -name "*java-11*" -type d | head -1)
fi

echo "JAVA_HOME: $JAVA_HOME"
export PATH=$JAVA_HOME/bin:$PATH

# Test Java installation
echo "Testing Java installation..."
$JAVA_HOME/bin/java -version

# Test Maven installation
echo "Testing Maven installation..."
/usr/bin/mvn -version

# Current directory info
echo "Current directory: $(pwd)"
echo "Files in directory:"
ls -la

# Skip Maven wrapper, use system Maven directly
echo "Building with system Maven (bypassing wrapper)..."
/usr/bin/mvn clean package -DskipTests \
    -Dmaven.compiler.source=11 \
    -Dmaven.compiler.target=11 \
    -Djava.home=$JAVA_HOME

# Check build result
if [ -f "target/FinJar-0.0.1-SNAPSHOT.jar" ]; then
    echo "✅ Build completed successfully!"
    echo "JAR file details:"
    ls -la target/FinJar-0.0.1-SNAPSHOT.jar
    echo "JAR file size: $(du -h target/FinJar-0.0.1-SNAPSHOT.jar | cut -f1)"
else
    echo "❌ Build failed - JAR file not found!"
    
    echo "=== Debugging Information ==="
    echo "JAVA_HOME: $JAVA_HOME"
    echo "Java executable: $JAVA_HOME/bin/java"
    echo "Java test: $($JAVA_HOME/bin/java -version 2>&1 | head -1)"
    echo "Maven executable: /usr/bin/mvn"
    echo "Maven test: $(/usr/bin/mvn -version 2>&1 | head -1)"
    
    if [ -d "target" ]; then
        echo "Target directory contents:"
        ls -la target/
    else
        echo "Target directory does not exist"
    fi
    
    echo "Build logs (if any):"
    find . -name "*.log" -exec echo "=== {} ===" \; -exec cat {} \;
    
    exit 1
fi
