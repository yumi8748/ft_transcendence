FROM node:18
WORKDIR /app
COPY package.json ./
RUN npm install
COPY app.js .
EXPOSE 3000
CMD [ "node", "app.js" ]
#CMD ["npm", "run", "dev"]