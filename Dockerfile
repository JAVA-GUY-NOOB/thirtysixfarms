# FarmCity Backend Dockerfile
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy the JAR file
COPY target/farmcity-ecommerce-*.jar app.jar

# Expose the application port
EXPOSE 8080

# Set environment variables (these should be overridden in production)
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
