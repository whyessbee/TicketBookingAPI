FROM node:16.16

WORKDIR /usr/build
 
COPY . .
RUN npm i

EXPOSE 3002

CMD ["node", "index.js"]

