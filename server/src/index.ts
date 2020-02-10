import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user.resolver';
import * as TypeOrm from 'typeorm';
import { CategoryResolver } from './resolvers/category.resover';
import { Container } from 'typedi';

// register 3rd party IOC container
TypeOrm.useContainer(Container);

async function bootstrap() {
  try {
    const app = express();

    app.get('/', (_, res) => {
      res.send('hello');
    });

    // DB connection
    await TypeOrm.createConnection();

    // graphql set-up
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [UserResolver, CategoryResolver],
        container: Container
      }),
      context: ({ req, res }) => ({ req, res })
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
      console.log('express server started');
    });
  } catch (e) {
    console.log(e);
  }
}

bootstrap();
