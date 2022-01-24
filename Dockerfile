FROM python:3.9-alpine

WORKDIR /opt/pyast
ADD . /opt/pyast

RUN apk update && \
    apk add g++ make && \
    apk add nodejs npm && \
    pip install -r requirements.txt && \
    cd /opt/pyast/front && \
    npm set progress=false && \
    npm install && \
    npm run build

EXPOSE 4361

CMD ["/usr/bin/env", "gunicorn", "app:app", "-w", "1", "-b", "0.0.0.0:4361"]
