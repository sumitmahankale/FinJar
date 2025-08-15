#!/bin/bash
echo "Setting up portable Java runtime..."

# Download and extract portable OpenJDK
if [ ! -d "jdk" ]; then
    echo "Downloading OpenJDK 11..."
    curl -L -o openjdk.tar.gz "https://github.com/adoptium/temurin11-binaries/releases/download/jdk-11.0.20%2B8/OpenJDK11U-jre_x64_linux_hotspot_11.0.20_8.tar.gz"
    tar -xzf openjdk.tar.gz
    mv jdk-11.0.20+8-jre jdk
    rm openjdk.tar.gz
fi

echo "Starting Spring Boot application..."
./jdk/bin/java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/FinJar-0.0.1-SNAPSHOT.jar
