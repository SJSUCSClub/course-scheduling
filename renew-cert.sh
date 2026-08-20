#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

NGINX_CONTAINER_NAME=lenses-nginx

echo "[INFO] Running certificate renewal..."
docker compose -f docker-compose.certbot.yml run --rm --no-deps certbot renew
docker exec $NGINX_CONTAINER_NAME nginx -s reload

echo "[INFO] Renewal finished"
