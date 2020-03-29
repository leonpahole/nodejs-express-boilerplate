# Node.js boilerplate

Boilerplate I use for Node.js apps. Compiled and adapted from the following sources:

- https://github.com/BretFisher/node-docker-good-defaults
- https://github.com/santiq/bulletproof-nodejs
- https://github.com/RobinBuschmann/sequelize-typescript-example
- https://www.docker.com/blog/how-to-deploy-on-remote-docker-hosts-with-docker-compose/

## Checklist

- [x] SQL Database (connector, models, seeds, migrations)
- [x] REST architecture
- [x] Typescript
- [x] Docker for local development
- [x] Docker for production
- [x] Request param validation
- [x] VS Code debugging support
- [ ] Docker swarm integration + secrets
- [ ] Socket.io
- [x] Middleware
- [x] Authentication
- [ ] Error handling with proper HTTP codes
- [ ] Fix database connection refused when first starting the app

## Start developing

Run build:

`make build`

Run containers:

`make up`

Migrate:

`make migate`

Seed:

`make seed`

Check status:

`make ps`

Check logs:

`make logs`

Exec into api:

`make exec`

## Add migration

```
docker-compose exec api npx sequelize-cli migration:create --name add_password_to_users
```

# Build production image

Create `build_and_release.env` (from example file) and fill in your image name and username for Docker hub. Then run `build_and_release.sh`. The script will build image, then prompt for deployment parameters and deploy the project and increment version.

# Deploy to production

Note: you need at least docker-compose version 1.26 for below code to work. If it doesn't work, you can just manually deploy to a server.

Note: you should change `MaxSessions` parameter on your server from 10 to 500 (in `/etc/ssh/sshd_config`).

Use `prod_deploy` to deploy your LOCAL `docker-compose.prod.yml` with your local `env.prod` settings. You can use all of the development make commands (except `exec` and `build`) with prefix `prod_`.

Run containers:

`make prod_up`

Migrate:

`make prod_migate`

Seed:

`make prod_seed`

Check status:

`make prod_ps`

Check logs:

`make prod_logs`
