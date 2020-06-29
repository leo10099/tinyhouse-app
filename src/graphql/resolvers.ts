import { MongoCallback, ObjectId } from "mongodb";
import { IResolvers } from "apollo-server-express";
import { Database, Listing } from "../lib/types";

export const resolvers: IResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _args: Record<string, unknown>,
      { db }: { db: Database }
    ): Promise<{
      (): Promise<Listing[]>;
      (callback: MongoCallback<Listing[]>): void;
    }> => {
      return db.listings.find({}).toArray;
    },
  },

  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing | undefined> => {
      const deletionAttempResult = await db.listings.findOneAndDelete({
        _id: new ObjectId(id),
      });

      if (!deletionAttempResult.value) {
        throw new Error("Faild to delete listing");
      }

      return deletionAttempResult.value;
    },
  },
};
