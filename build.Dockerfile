FROM node:18-alpine3.19 as node
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@17.0.9
RUN ln -s /app/node_modules node_modules
COPY . /app
ENTRYPOINT ["ng", "build"]
