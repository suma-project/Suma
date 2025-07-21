FROM php:8.1-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev libonig-dev zip unzip curl default-mysql-client && \
    docker-php-ext-install pdo_mysql mbstring zip && \
    a2enmod rewrite && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
    rm -rf /var/lib/apt/lists/*

# Copy local suma code into image at /app/suma
COPY --chown=www-data:www-data . /app/suma

# Set working dir
WORKDIR /app/suma

# Create web root dirs (will be symlinked)
RUN mkdir -p /var/www/html/suma/

# Entrypoint & startup script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
