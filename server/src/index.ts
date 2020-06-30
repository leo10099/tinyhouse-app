require("dotenv").config();
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

const PORT = process.env.PORT || 9000;

const mount = async (app: Application) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({
      db,
    }),
  });
  server.applyMiddleware({ app, path: "/api" });

  app.listen(PORT);

  const db = await connectDatabase();

  console.log(`[app]: http://localhost:${PORT}`);

  const listings = await db.listings.find({}).toArray();
  console.log(listings);
};

mount(express());
