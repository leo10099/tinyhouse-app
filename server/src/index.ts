require("dotenv").config();
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

const PORT = process.env.PORT || 9000;

const mount = async (app: Application) => {
  app.use(cookieParser(process.env.COOKIE_SECRET));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({
      db,
      req,
      res,
    }),
  });
  server.applyMiddleware({ app, path: "/api" });

  app.listen(PORT);

  const db = await connectDatabase();

  console.log(`[app]: http://localhost:${PORT}`);
};

mount(express());
