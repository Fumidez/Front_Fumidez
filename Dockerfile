# docker build -t axelxavier/fumidez .
#docker push axelxavier/fumidez

FROM node:lts-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g http-server
CMD ["http-server", "dist", "-p", "5173"]