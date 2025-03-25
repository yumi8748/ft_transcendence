FROM node:20

WORKDIR /app

COPY ./tools/* .
RUN npm install


#COPY ./database ./database
COPY ./plugins/* ./plugins/
# COPY ./public/* ./public/
COPY ./routes/* ./routes/

COPY ./app.js .

#copy the rest of the files needed
#COPY app.js ./

EXPOSE 3001

CMD [ "node", "app.js" ]