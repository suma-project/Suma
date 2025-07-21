#!/bin/bash
set -e

# Paths
WEB_DIR="/var/www/html"
SUMA_DIR="/app/suma"
SUMA_LOG="/var/log/suma.log"

# Generate Apache config with environment variables
cat > /etc/apache2/sites-available/000-default.conf <<EOF
<VirtualHost *:80>
    DocumentRoot ${WEB_DIR}

    Alias /sumaserver ${SUMA_DIR}/service/web
    Alias /suma/client ${SUMA_DIR}/web
    Alias /suma/analysis ${SUMA_DIR}/analysis

    <Location "/suma">
        Options -Indexes +FollowSymLinks
        Require all granted
    </Location>

    <Location "/sumaserver">
        Options -Indexes +FollowSymLinks
        AllowOverride All
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} -s [OR]
        RewriteCond %{REQUEST_FILENAME} -l [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^.*$ - [NC,L]
        RewriteRule ^.*$ index.php [NC,L]
        Require all granted
    </Location>

    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

# Enable rewrite module (already enabled in Dockerfile but safe here)
a2enmod rewrite

# Generate Suma config.yaml from env vars if not exists
CONFIG_PATH="${SUMA_DIR}/service/web/config/config.yaml"
if [ ! -f "$CONFIG_PATH" ]; then
  echo "Generating Suma config.yaml..."
  cat > "$CONFIG_PATH" <<EOC
SUMA_SERVER_PATH: $SUMA_DIR/service
SUMA_CONTROLLER_PATH: $SUMA_DIR/service/controllers
SUMA_BASE_URL: /sumaserver
SUMA_DEBUG: true
EOC
fi

# Generate Suma config.yaml from env vars if not exists
ANALYSIS_CONFIG_PATH="${SUMA_DIR}/analysis/config/config.yaml"
if [ ! -f "$ANALYSIS_CONFIG_PATH" ]; then
  echo "Generating Suma Analysis config.yaml..."
  cat > "$ANALYSIS_CONFIG_PATH" <<EOC
showErrors: false
serverIO:
    baseUrl: ${SERVICE_URL}/sumaserver/query
analysisBaseUrl: ${SERVICE_URL}/suma/analysis/reports
nightly:
    timezone: ${SUMA_ANALYTICS_TIMEZONE}
    displayFormat: Y-m-d
    recipients: ${SUMA_ANALYTICS_RECIPIENTS}
    errorRecipients: ${SUMA_ANALYTICS_ERROR_RECIPIENTS}
    emailFrom: "${SUMA_ANALYTICS_EMAIL_FROM}"
    emailSubj: "${SUMA_ANALYTICS_EMAIL_SUBJECT}"
EOC
fi

# Generate Suma Database config.yaml from env vars if not exists
DB_CONFIG_PATH="${SUMA_DIR}/service/config/config.yaml"
if [ ! -f "$DB_CONFIG_PATH" ]; then
  echo "Generating Suma DB config.yaml..."
  cat > "$DB_CONFIG_PATH" <<EOC
production:
    sumaserver:
        db:
            host: ${DB_HOST}
            platform: Pdo_Mysql
            dbname: ${DB_NAME}
            user: ${DB_USER}
            pword: ${DB_PASS}
            port: ${DB_PORT}
        log:
            path:
            name: ${SUMA_LOG}
        admin:
            user: ${SUMA_ADMIN_USER}
            pass: ${SUMA_ADMIN_PASS}
    queryserver:
        db:
            limit: 10000

development:
    _extends: production
    sumaserver:
        db:
            dbname: sumadev
        log:
            path:
EOC
fi

SUMA_CLIENT_CONFIG_PATH="${SUMA_DIR}/web/config/spaceassessConfig.js"
if [ ! -f "$SUMA_CLIENT_CONFIG_PATH" ]; then
  echo "Generating Suma spaceassessConfig.js..."
  cp ${SUMA_DIR}/web/config/spaceassessConfig_example.js ${SUMA_CLIENT_CONFIG_PATH}
fi


# Install PHP dependencies if composer.json is present
if [ -f "${SUMA_DIR}/composer.json" ]; then
  echo "Installing PHP dependencies via Composer..."
  cd "${SUMA_DIR}"
  composer install --no-interaction --prefer-dist --optimize-autoloader
  chown -R www-data:www-data ${SUMA_DIR}
fi

# create suma.log file
echo "Touching suma.log..."
touch ${SUMA_LOG}
chown www-data:www-data ${SUMA_LOG}

# Chown of files for webserver
chown www-data:www-data ${SUMA_CLIENT_CONFIG_PATH} ${DB_CONFIG_PATH} ${CONFIG_PATH}

# Wait for MySQL to be ready before starting Apache
if [ -n "$DB_HOST" ]; then
  echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."
  for i in {1..30}; do
    if mysqladmin ping -h"$DB_HOST" -P"${DB_PORT:-3306}" --silent; then
      echo "MySQL is up!"
      break
    fi
    echo "Waiting for MySQL... retry $i/30"
    sleep 2
  done
fi

exec "$@"
