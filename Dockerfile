FROM python:2.7-alpine

WORKDIR /opt/pyast
ADD . /opt/pyast

RUN apk update && \
    apk add g++ make && \
    apk add nodejs && \
    pip install -r requirements.txt && \
    cd /opt/pyast/front && \
    npm set progress=false && \
    npm install && \
    npm run build

EXPOSE 4361

CMD ["gunicorn", "app:app", "-w" "4", "-b", "'0.0.0.0:4361'"]
