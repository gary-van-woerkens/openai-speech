FROM node:18-alpine

WORKDIR /app

COPY src .
COPY next.config.js .
COPY package.json .
COPY postcss.config.js .
COPY tailwind.config.ts .
COPY tsconfig.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile
RUN yarn build
