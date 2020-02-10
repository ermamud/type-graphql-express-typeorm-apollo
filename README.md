Example of Integrating `TypeGraphQL` using `Apollo Server` with `Express`, `TypeOrm` and Dependency Injection with `typedi`

## Server

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

You will find in this Project:

- In the Entity folder, you can see examples of `One to One`, `One To Many` and `Many to Many` relationships between entities using `TypeORM`
- How to upload an image/file and write its content as `base64` inside a database table
- Dependency Injection for `TypeORM` repositories, as well as Domain Services (for bussiness logic)
- well separation between GraphQL resolvers, services and data layer
- JWT authentication and authorization by resolvers and roles (Refresh token will come soon)
- TypeORM schema sync is disabled by default, please execute `typeorm schema:sync` in your terminal for creating all the entities in the DB. You might execute as well `typeorm migration:run` for the migration tables
- Unit Tests cooming soon as well

## Web

Coming soon (with React)
