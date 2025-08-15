# Railway Deployment Configuration
# This is a Spring Boot Java application
# Main application is in the backend/ directory

## Build Instructions
- Maven project located in `backend/`
- Build command: `cd backend && ./mvnw clean package -DskipTests`
- Start command: `cd backend && java -jar target/FinJar-0.0.1-SNAPSHOT.jar`

## Environment Variables Required
- DATABASE_URL
- DB_USERNAME  
- DB_PASSWORD
- SPRING_PROFILES_ACTIVE=prod
- JWT_SECRET
- CORS_ORIGINS
