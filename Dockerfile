FROM node:16 AS builder

WORKDIR /usr/src

COPY nest-cli.json package.json yarn.lock tsconfig.json tsconfig.build.json ./
COPY src ./src/

RUN npm install -g @nestjs/cli
RUN yarn install

RUN yarn build

FROM node:16

WORKDIR /usr/src/app

COPY --from=builder /usr/src/package.json .
COPY --from=builder /usr/src/dist ./dist

RUN yarn install --prod
CMD ["yarn", "start:prod"]
