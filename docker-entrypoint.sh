#!/bin/bash
set -e

if [ "$1" = 'apache2' ]; then
    # set suma server config
    cd "$SUMA_APP_DIR/sumaserver"
    sed -i 's@host.*$@host: '"$SUMA_DB_HOST"'@' config/config.yaml
    sed -i 's@platform.*$@platform: '"$SUMA_DB_PLATFORM"'@' config/config.yaml
    sed -i 's@dbname.*$@dbname: '"$SUMA_DB_NAME"'@' config/config.yaml
    sed -i 's@DB_USERNAME@'"$SUMA_DB_USER"'@' config/config.yaml
    sed -i 's@DB_PASSWORD@'"$SUMA_DB_PASSWORD"'@' config/config.yaml
    sed -i 's@port.*$@port: '"$SUMA_DB_PORT"'@' config/config.yaml
    sed -i 's@path.*$@path: '"$SUMA_LOG_PATH"'@' config/config.yaml
    sed -i 's@user: admin@user: '"$SUMA_ADMIN_USER"'@' config/config.yaml
    sed -i 's@pass: admin@pass: '"$SUMA_ADMIN_PASSWORD"'@' config/config.yaml
    # set log level
    cd "$SUMA_WEB_DIR/sumaserver"
    sed -i 's@SUMA_DEBUG:.*@SUMA_DEBUG: '"$SUMA_DEBUG"'@' config/config.yaml
    # set timezone
    echo -e "date.timezone = \"$TZ\"" >> /usr/local/etc/php/conf.d/php.ini
    # start server
    source /etc/apache2/envvars
    exec apache2 -D FOREGROUND
fi

exec "$@"
