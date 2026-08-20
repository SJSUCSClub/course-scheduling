#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

CERTBOT_NGINX_NAME=lenses-certbot-nginx

echo "[INFO] Starting certbot nginx..."
docker compose -f docker-compose.certbot.yml up -d nginx

if [ ! -d "./certbot/conf/live/lenses.acmsjsu.org" ]; then
    echo "[INFO] Issuing first certificate..."
    docker compose -f docker-compose.certbot.yml run --rm certbot certonly \
        --webroot -w /var/www/certbot \
        -d lenses.acmsjsu.org -d www.lenses.acmsjsu.org \
        --email acm.sjsu@gmail.com \
        --agree-tos \
        --non-interactive
else
    echo "[INFO] Certificate already exists. Skipping first issuance."
fi

docker stop $CERTBOT_NGINX_NAME

echo "[INFO] Building and starting staging stack..."
docker compose --env-file .env.staging -f docker-compose.stagingbuild.yml build --no-cache
docker compose --env-file .env.staging -f docker-compose.stagingbuild.yml up -d

docker compose --env-file .env.staging -f docker-compose.staging.yml build --no-cache client
docker compose --env-file .env.staging -f docker-compose.staging.yml up client -d

docker compose --env-file .env.staging -f docker-compose.stagingbuild.yml down
docker compose --env-file .env.staging -f docker-compose.staging.yml up -d

echo "[INFO] Deployment finished"
