FROM node:22-alpine

WORKDIR /app

# Update npm to latest version to fix remaining vulnerabilities
RUN npm install -g npm@latest

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 5001

CMD ["node", "server.js"]