FROM node:18

WORKDIR /app

#copy the list of dependencies if they exist
COPY tools/package.json ./

#install the dependencies
RUN npm install

#copy the rest of the files needed
COPY tools/app.js ./

EXPOSE 3000

CMD [ "node", "app.js" ]
