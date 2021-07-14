FROM node:14

EXPOSE 80

RUN mkdir -p /opt/genji
RUN mkdir -p /opt/genji/app
RUN mkdir -p /opt/genji/app/html

COPY ./app/package.json /opt/genji/app/
COPY ./app/html/package.json /opt/genji/app/html/

RUN npm install --prefix /opt/genji/app/
RUN npm install --prefix /opt/genji/app/html/

COPY ./ /opt/genji/

WORKDIR /opt/genji/app
ENTRYPOINT npm start

LABEL author="Ben Lanning <blanning@all-mode.com>"
LABEL version="1.0.10"
