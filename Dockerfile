FROM node:latest

WORKDIR /Backend

COPY package*.json ./

RUN npm i -f 

COPY . .

CMD ["nest","start","-w"]
