# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package.json ./
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend with Frontend files
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /backend
COPY devconnect/devconnect/pom.xml ./
RUN mvn dependency:go-offline

COPY devconnect/devconnect/src ./src
# Frontend ki build files ko Spring Boot ke static folder mein copy karna
COPY --from=frontend-build /frontend/build ./src/main/resources/static

RUN mvn clean package -DskipTests

# Stage 3: Final Runtime Image (Monolith with Postgres)
FROM eclipse-temurin:17-jre-jammy

# Install PostgreSQL 15, sudo
RUN apt-get update && \
    apt-get install -y postgresql sudo && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Setup Postgres environment
ENV PGDATA=/var/lib/postgresql/data
RUN mkdir -p /var/lib/postgresql/data && \
    chown -R postgres:postgres /var/lib/postgresql/data

# Copy builds
COPY --from=backend-build /backend/target/*.jar app.jar
COPY entrypoint.sh .

# Permissions
RUN chmod +x entrypoint.sh

# Ports
EXPOSE 8085 5432

# The Magic Launcher
ENTRYPOINT ["./entrypoint.sh"]
