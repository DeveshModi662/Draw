FROM maven:3.9.11-eclipse-temurin-25 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests
FROM openjdk:24-ea-jdk
WORKDIR /app
COPY --from=build /app/target/serviceregistry-app.jar .
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "/app/serviceregistry-app.jar"]