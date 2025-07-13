FROM node:18-alpine

RUN apk add --no-cache python3 make g++ py3-pip

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps --no-fund --no-audit

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]