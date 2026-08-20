# Required Steps for Development Environment

To get started, try out the docker compose. It requires that you have the following files in the project's root directory.

- `createdb.sql`
- `.env`

this should be in project's server/ directory

- `client_secret.json`

Assuming you do, then using the Docker compose is as simple as running `docker compose -f docker-compose.dev.yml up --build`. This will run the development Docker containers, allowing the Next.js and Django containers to restart whenever you make a change. It will also rebuild the docker container if any changes to the Dockerfile or the environment happened.
To take down the Docker compose, make sure to run `docker compose -f <compose-file> down`.

To expose the backend to https traffic, you can use `ngrok` (or any reverse proxy). Simply run `ngrok http 8000` and you'll be able to access the backend on the url it provides.

## Deploying Staging

To deploy the staging environment, make sure to have

- `.env.staging`
- `.createdb.sql`
  in the project root

this should be in project's server/ directory

- `client_secret.json`

Then, run `./setup-staging.sh` to build and start the containers and install the cert-renewal cron job, or `./deploy-staging.sh` alone to (re)deploy without touching cron.

On first run, `deploy-staging.sh` spins up a short-lived nginx/certbot pair (`docker-compose.certbot.yml`) to issue the TLS certificate for `lenses.acmsjsu.org` via the HTTP-01 webroot challenge, then stops it and builds/starts the real staging stack (`docker-compose.stagingbuild.yml` → `docker-compose.staging.yml`), whose nginx serves both the redirect from HTTP to HTTPS and the app. `renew-cert.sh` (installed as a cron job every 5 minutes by `setup-staging.sh`) renews the certificate in place and reloads the running nginx container — no downtime and no need to stop the app stack.
