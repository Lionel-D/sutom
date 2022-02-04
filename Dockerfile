FROM node:16-alpine

ARG MODE=production

ENV NODE_ENV=$MODE

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
