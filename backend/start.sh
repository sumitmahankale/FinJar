#!/bin/bash
echo "Setting up Java runtime..."
source ~/.sdkman/bin/sdkman-init.sh
sdk use java 11.0.12-tem

echo "Starting Spring Boot application..."
java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/FinJar-0.0.1-SNAPSHOT.jar
