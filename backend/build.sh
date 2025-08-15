#!/bin/bash
# Install Java 11
echo "Installing Java 11..."
curl -s "https://get.sdkman.io" | bash
source ~/.sdkman/bin/sdkman-init.sh
sdk install java 11.0.12-tem

# Build the application
echo "Building Spring Boot application..."
chmod +x ./mvnw
./mvnw clean package -DskipTests

echo "Build completed successfully!"
