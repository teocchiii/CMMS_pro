FROM eclipse-temurin:21-jre
WORKDIR /app
# Solo copiamos el .jar que ya compilamos en el Mac
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
