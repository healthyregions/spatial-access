FROM node:18.1 as FRONTEND 

RUN mkdir /app

COPY access_frontend/package.json /app/package.json

WORKDIR /app

RUN yarn 

COPY access_frontend /app

RUN yarn build

FROM python:3

RUN apt-get update && apt-get -y install  libspatialindex-dev python-tk


RUN pip install waitress


MAINTAINER Stuart Lynn "stuart.lynn@gmail.com"

COPY spatial_access_api/requirements.txt /app/requirements.txt

WORKDIR /app
RUN pip install -r requirements.txt

COPY spatial_access_api /app

COPY --from=FRONTEND /app/build /app/react_app

EXPOSE 5000

CMD ["python", "server.py", "--deploy", "--port", "5000"]
