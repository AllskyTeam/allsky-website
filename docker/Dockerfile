FROM php:8.1-apache

RUN apt update && \
    apt install -y ffmpeg zlib1g-dev libpng-dev

RUN docker-php-ext-install gd

WORKDIR /var/www/html

ENV ALLSKY_CONFIG /var/www/html

ADD . .
