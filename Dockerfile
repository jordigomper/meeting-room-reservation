FROM node:latest
RUN npm install -g nodemon
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . /usr/src/app
VOLUME .:/usr/src/app
EXPOSE 8081 27017
CMD nodemon src/server.ts