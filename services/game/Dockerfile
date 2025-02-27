FROM node:20

WORKDIR /app

COPY tools/package.json ./

RUN npm install -g npm@11.1.0
#RUN npm install

COPY tools/app.js ./

EXPOSE 3000
CMD ["node", "app.js"]
