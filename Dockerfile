FROM node:20

ENV TZ=Asia/Tashkent
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ >/etc/timezone

WORKDIR /usr/src/callback
COPY . .

RUN apt update
RUN npm install -g npm@latest && cd /usr/src/callback && npm install && npm run migrate && npm install -g pm2@latest

CMD ["pm2-runtime", "./src/server.js", "--no-autorestart"]
