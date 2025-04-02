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

Then, run the `./runserver.sh` bash script to compose the containers.
