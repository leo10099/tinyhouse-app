import merge from "lodash.merge";
import { viewerResolvers } from "./viewer";
import { userResolvers } from "./user";
import { listingResolvers } from "./listing";
import { bookingResolvers } from "./bookings";

export const resolvers = merge(
  viewerResolvers,
  userResolvers,
  listingResolvers,
  bookingResolvers
);
