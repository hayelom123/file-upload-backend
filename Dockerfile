FROM node:26-alpine

COPY package*.json  /app/

WORKDIR /app/

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD [ "npm", "start" ]