FROM node:20

WORKDIR /app

#copy the list of dependencies if they exist
COPY tools/* ./

#install the dependencies
RUN npm install

#copy the rest of the files needed
COPY app.js ./

EXPOSE 3002

CMD [ "node", "app.js" ]
