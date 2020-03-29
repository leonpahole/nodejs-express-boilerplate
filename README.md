# Node.js boilerplate

Boilerplate I use for Node.js apps. Compiled and adapted from the following sources:

- https://github.com/BretFisher/node-docker-good-defaults
- https://github.com/santiq/bulletproof-nodejs
- https://github.com/RobinBuschmann/sequelize-typescript-example

## Checklist

- [x] SQL Database (connector, models, seeds, migrations)
- [x] REST architecture
- [x] Typescript
- [x] Docker for local development
- [ ] Docker for production
- [x] Request param validation
- [x] VS Code debugging support
- [ ] Socket.io
- [ ] Middleware
- [ ] Authentication
- [ ] Error handling with proper HTTP codes

## Start developing

To install dependencies:

`make install`

Run build:

`make build`

Run containers:

`make dev`

Migrate:

`make migate`

Seed:

`make seed`

## Add migration

```
docker-compose exec api npx sequelize-cli migration:create --name add_password_to_users
```
