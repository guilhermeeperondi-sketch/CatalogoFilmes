FROM php:8.2-apache

# Instala as dependências necessárias para a API (curl) e Banco (pdo_mysql)
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    pkg-config \
    libssl-dev \
    && docker-php-ext-install pdo pdo_mysql curl

# Ativa o módulo de reescrita do Apache
RUN a2enmod rewrite
