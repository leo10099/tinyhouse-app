import { IResolvers } from "apollo-server-express";

export const userResolvers: IResolvers = {
  Query: {
    user: () => "Query.user",
  },
};
