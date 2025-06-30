# docker build -t axelxavier/fumidez .
#docker push axelxavier/fumidez

FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm install

# Este paso es crucial para que se genere el directorio dist correctamente
RUN npm run build

RUN npm install -g http-server

CMD ["http-server", "dist", "-p", "5173"]
