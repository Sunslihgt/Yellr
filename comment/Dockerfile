FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

RUN npm run build

EXPOSE 5002

CMD ["npm", "start"] 