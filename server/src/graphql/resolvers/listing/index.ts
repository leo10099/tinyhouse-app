import { IResolvers } from "apollo-server-express";
import { Database, Listing, User } from "../../../lib/types";
import { ListingArgs } from "./types";
import { ObjectId } from "mongodb";
import { authorize } from "../../../lib/utils";
import { Request } from "express";
import { ListingBookingsArgs, ListingBookingsData } from "./types";

export const listingResolvers: IResolvers = {
  Query: {
    listing: async (
      _root: undefined,
      { id }: ListingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Listing> => {
      try {
        const listing = await db.listings.findOne({ _id: new ObjectId(id) });
        if (!listing) throw new Error("Couldn't found listing");

        const viewer = await authorize(db, req);

        if (viewer?._id === listing.host) {
          listing.authorized = true;
        }

        return listing;
      } catch (error) {
        throw new Error("Failed to query listing: " + error);
      }
    },
  },
  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toHexString();
    },
    host: async (
      listing: Listing,
      _args: unknown,
      { db }: { db: Database }
    ): Promise<User> => {
      const host = await db.users.findOne({ _id: listing.host });
      if (!host) throw new Error("Host couldn't be found");

      return host;
    },
    bookingsIndex: (listing: Listing): string =>
      JSON.stringify(listing.bookingsIndex),
    bookings: async (
      listing: Listing,
      { limit, page }: ListingBookingsArgs,
      { db }: { db: Database }
    ): Promise<ListingBookingsData | null> => {
      try {
        if (!listing.authorized) return null;

        const data: ListingBookingsData = {
          total: 0,
          result: [],
        };
        const cursor = await db.bookings.find({
          _id: { $in: listing.bookings },
        });

        cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Failed to query user listing bookings: ${error}`);
      }
    },
  },
};