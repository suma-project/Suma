FROM php:7.0-apache

# Configuration
ENV SUMA_WEB_DIR /var/www/html
ENV SUMA_APP_DIR /var/www/app
ENV SUMA_LOG_PATH /var/log/suma/
ENV SUMA_ADMIN_USER admin
ENV SUMA_ADMIN_PASSWORD suma
ENV SUMA_DEBUG false
ENV TZ America/Los_Angeles

# Database configuration
ENV SUMA_DB_HOST localhost
ENV SUMA_DB_PLATFORM Pdo_Mysql
ENV SUMA_DB_NAME suma
ENV SUMA_DB_USER admin
ENV SUMA_DB_PASSWORD suma
ENV SUMA_DB_PORT 3306

# Install dependencies
RUN docker-php-ext-install pdo_mysql

# Install suma server & client
RUN mkdir -p "$SUMA_WEB_DIR/suma/web" \
             "$SUMA_WEB_DIR/suma/analysis" \
             "$SUMA_APP_DIR/sumaserver" \
             "$SUMA_WEB_DIR/sumaserver"
COPY web "$SUMA_WEB_DIR/suma/web"
COPY analysis "$SUMA_WEB_DIR/suma/analysis"
COPY service "$SUMA_APP_DIR/sumaserver"
COPY service/web "$SUMA_WEB_DIR/sumaserver"

# Configure apache
COPY suma.conf /etc/apache2/sites-available
RUN a2enmod rewrite
RUN a2ensite suma
RUN a2dissite 000-default
WORKDIR "$SUMA_WEB_DIR/sumaserver"
RUN mv htaccess_example .htaccess

# Configure suma server
RUN mv config/config_example.yaml config/config.yaml
RUN sed -i 's@SUMA_SERVER_PATH.*@SUMA_SERVER_PATH: '"$SUMA_APP_DIR"'\/sumaserver@' config/config.yaml
RUN sed -i 's@SUMA_CONTROLLER_PATH.*@SUMA_CONTROLLER_PATH: '"$SUMA_APP_DIR"'\/sumaserver\/controllers@' config/config.yaml
RUN sed -i 's@SUMA_BASE_URL.*@SUMA_BASE_URL: \/sumaserver@' config/config.yaml
WORKDIR "$SUMA_APP_DIR/sumaserver"
RUN mv config/config_example.yaml config/config.yaml
RUN mv config/session_example.yaml config/session.yaml
RUN sed -i 's@cookie_path:.*@cookie_path: \/sumaserver@' config/session.yaml
RUN mkdir -p "$SUMA_LOG_PATH"
RUN chown www-data "$SUMA_LOG_PATH"

# Configure suma client
WORKDIR "$SUMA_WEB_DIR/suma/web"
RUN mv config/spaceassessConfig_example.js config/spaceassessConfig.js

# Configure suma analysis tools
WORKDIR "$SUMA_WEB_DIR/suma/analysis"
RUN mv config/config_example.yaml config/config.yaml
RUN sed -i 's@baseUrl:.*@baseUrl: http:\/\/localhost\/sumaserver\/query@' config/config.yaml
RUN sed -i 's@analysisBaseUrl:.*@analysisBaseUrl: http:\/\/localhost\/suma\/analysis\/reports@' config/config.yaml

# Run the app
COPY docker-entrypoint.sh /usr/local/bin
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2"]
