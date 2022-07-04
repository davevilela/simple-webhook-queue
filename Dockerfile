FROM node

RUN npm install -g @nestjs/cli@8.2.6

USER node

WORKDIR /home/node/app
