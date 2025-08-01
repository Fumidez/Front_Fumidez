# Stage 1: Build la app con Node
FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Servir con Express (server.js)
FROM node:lts-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/package*.json ./

RUN npm install express

EXPOSE 5173

CMD ["node", "server.js"]
