# FROM eclipse-temurin:17-jdk-alpine
# VOLUME /tmp
# ARG JAR_FILE=target/*.jar
# COPY ${JAR_FILE} app.jar
# ENTRYPOINT ["java", "-jar", "/app.jar"]


FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]




# # ===== Stage 1: Build the JAR =====
# FROM maven:3.9.6-eclipse-temurin-17 AS build
# WORKDIR /build

# # Copy pom.xml and download dependencies first
# COPY pom.xml .
# RUN mvn dependency:go-offline

# # Copy all source code
# COPY src ./src

# # Package the application
# RUN mvn clean package -DskipTests

# # ===== Stage 2: Run the JAR =====
# FROM eclipse-temurin:17-jdk-alpine
# WORKDIR /app

# # Copy JAR from builder stage
# COPY --from=build /build/target/*.jar app.jar

# # Expose port (optional)
# EXPOSE 8080

# # Run the application
# ENTRYPOINT ["java", "-jar", "app.jar"]





# # Use official lightweight JDK base image
# FROM eclipse-temurin:17-jdk-alpine

# # Set working directory inside container
# WORKDIR /app

# # Copy built jar file from host to container
# ARG JAR_FILE=target/*.jar
# COPY ${JAR_FILE} app.jar

# # Expose application port (optional here)
# EXPOSE 8080

# # Run the jar file
# ENTRYPOINT ["java", "-jar", "/app/app.jar"]


