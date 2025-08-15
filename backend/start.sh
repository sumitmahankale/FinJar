#!/bin/bash
echo "Installing Java runtime..."

# Install Java 11 using apt-get (more reliable on Render)
apt-get update -qq
apt-get install -y openjdk-11-jre-headless

echo "Java installed. Starting Spring Boot application..."
java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/FinJar-0.0.1-SNAPSHOT.jar
