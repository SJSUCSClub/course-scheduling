sudo docker compose --env-file .env.staging -f docker-compose.stagingbuild.yml build --no-cache
sudo docker compose --env-file .env.staging -f docker-compose.stagingbuild.yml up -d

sudo docker compose --env-file .env.staging -f docker-compose.staging.yml build --no-cache client
sudo docker compose --env-file .env.staging -f docker-compose.staging.yml up client -d

sudo docker compose --env-file .env.staging -f docker-compose.staging.yml up -d

