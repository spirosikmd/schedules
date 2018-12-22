FROM node:8

WORKDIR /usr/src/app

COPY package.json yarn.lock server/package.json server/yarn.lock client/package.json client/yarn.lock ./

RUN yarn --production

COPY . .

RUN yarn build:client

EXPOSE 5000
CMD [ "yarn", "start" ]
