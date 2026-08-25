# Multi-stage Dockerfile for backend

# Build stage
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml mvnw ./.mvn/ ./
COPY src ./src
RUN mvn -B -DskipTests package

# Run stage
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /workspace/target/farmcity-ecommerce-0.0.1-SNAPSHOT.jar /app/app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD curl -f http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java","-jar","/app/app.jar"]
