FROM python:2.7-alpine

RUN apk update && apk add \
  g++ \
  make \
  nodejs

# apk does not install npm with nodejs since Alpine 3.6+
RUN apk add --update nodejs-npm

WORKDIR /opt/pyast/
COPY requirements.txt .
RUN pip install -r requirements.txt

WORKDIR /opt/pyast/front/
COPY front/ .
RUN npm set progress=false
RUN npm install
RUN npm run build

COPY app.py /opt/pyast/
COPY parse.py /opt/pyast/

EXPOSE 4361

WORKDIR /opt/pyast
CMD ["gunicorn", "app:app", "-w", "4", "-b", "0.0.0.0:4361"]
