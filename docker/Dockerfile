FROM php:8.1-apache

RUN apt update && \
    apt install -y ffmpeg zlib1g-dev libpng-dev

RUN docker-php-ext-install gd

ENV ALLSKY_CONFIG /var/www/html

COPY . /var/www/html
