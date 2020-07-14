import { IResolvers } from "apollo-server-express";
import { Booking, Listing, Database } from "../../../lib/types";

export const bookingResolvers: IResolvers = {
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toHexString();
    },
    listing: (
      booking: Booking,
      _args: unknown,
      { db }: { db: Database }
    ): Promise<Listing | null> => {
      return db.listings.findOne({ _id: booking.listing });
    },
  },
};
