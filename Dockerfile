FROM node:12.16

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG APP_PORT=4000
ENV APP_PORT $APP_PORT
EXPOSE $APP_PORT 9229

RUN mkdir /opt/node_app && chown node:node /opt/node_app
WORKDIR /opt/node_app

USER node

COPY package.json yarn.lock ./
RUN yarn global add node-gyp
RUN yarn install --ignore-scripts --frozen-lockfile
RUN npx node-pre-gyp rebuild -C ./node_modules/argon2

ENV PATH /opt/node_app/node_modules/.bin:$PATH

WORKDIR /opt/node_app/app
COPY . .

# compile dists in one directory above!
RUN npx tsc --outDir ../dist 

CMD [ "node", "../dist/app.js" ]