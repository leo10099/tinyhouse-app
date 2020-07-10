import merge from "lodash.merge";
import { viewerResolvers } from "./viewer";
import { userResolvers } from "./user";

export const resolvers = merge(viewerResolvers, userResolvers);
