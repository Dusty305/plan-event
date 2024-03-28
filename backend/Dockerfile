#
# BUILD STAGE
#
#FROM maven:3.6.0 as build
#WORKDIR /app/backend

#COPY pom.xml .
#RUN mvn clean package -Dmaven.main.skip -Dmaven.test.skip && rm -r target
#COPY src ./src
#RUN mvn clean package -Dmaven.test.skip
 
#COPY src /usr/src/app/src
#COPY pom.xml /usr/src/app
#RUN mvn -f /usr/src/app/pom.xml clean package

#
# PACKAGE STAGE
#
#FROM openjdk:17-jdk
#COPY --from=build app/backend/target/planevent-0.0.1-SNAPSHOT.jar /app/backend/target/planevent-0.0.1-SNAPSHOT.jar
#CMD ["java","-jar","/app/backend/target/planevent-0.0.1-SNAPSHOT.jar"]

#
# IF `mvn clean install` IS RUN LOCALLY 
#
FROM openjdk:17-oracle
COPY ./target/planevent-0.0.1-SNAPSHOT.jar /usr/app/planevent-0.0.1-SNAPSHOT.jar
CMD ["java","-jar","/usr/app/planevent-0.0.1-SNAPSHOT.jar"]
