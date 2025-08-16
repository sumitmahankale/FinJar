# Build stage
FROM maven:3.8.4-openjdk-11-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src src
RUN mvn clean package -DskipTests -B

# Runtime stage
FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=build /app/target/FinJar-0.0.1-SNAPSHOT.jar app.jar

# Simple startup
EXPOSE 8080
CMD ["java", "-Dserver.port=${PORT:-8080}", "-Dserver.address=0.0.0.0", "-jar", "app.jar"]
