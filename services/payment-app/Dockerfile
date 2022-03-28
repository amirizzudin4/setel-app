FROM node:16-alpine3.14

WORKDIR /app
COPY . .
RUN yarn install --silent
RUN yarn build
CMD yarn start
EXPOSE 3000
