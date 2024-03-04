FROM node:18-alpine3.19 as node

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

RUN npm install -g @angular/cli@17.0.9

RUN ln -s /app/node_modules node_modules

COPY . /app

CMD ng serve --host 0.0.0.0  --port 4200
#ENTRYPOINT ["ng", "build"]
