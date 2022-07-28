FROM node:14.17.0-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

#  add libraries needed to build canvas and install node_modules
RUN apk add --no-cache \
    build-base \
    g++ \
    libpng \
    libpng-dev \
    jpeg-dev \
    pango-dev \
    cairo-dev \
    giflib-dev \
    python \
    cairo && yarn --force && \
    yarn cache clean && \
    apk del build-base \
    g++ \
    python

CMD ["yarn", "start:dev"]
