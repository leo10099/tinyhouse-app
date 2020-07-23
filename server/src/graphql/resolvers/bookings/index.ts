import { IResolvers } from "apollo-server-express";
import { Request } from "express";
import {
  Booking,
  Listing,
  Database,
  BookingsIndex,
  User,
} from "../../../lib/types";
import { CreateBookingArgs } from "./types";
import { authorize } from "../../../lib/utils";
import { ObjectId } from "mongodb";
import { Stripe } from "../../../lib/api";

const MILLISECONDS_PER_DAY = 86400000;

export const resolveBookingsIndex = (
  bookingsIndex: BookingsIndex,
  checkInDate: string,
  checkOutDate: string
): BookingsIndex => {
  let dateCursor = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const newBookingsIndex: BookingsIndex = { ...bookingsIndex };

  // Insert days until reaching the checkout day
  while (dateCursor <= checkOut) {
    const year = dateCursor.getUTCFullYear();
    const month = dateCursor.getUTCMonth();
    const day = dateCursor.getUTCDate();

    if (!newBookingsIndex[year]) newBookingsIndex[year] = {};
    if (!newBookingsIndex[year][month]) newBookingsIndex[year][month] = {};
    if (!newBookingsIndex[year][month][day]) {
      newBookingsIndex[year][month][day] = true;
    } else {
      throw new Error(
        "Selected dates can't overlap dates that have already been booked."
      );
    }
    // Increment a day of the booked dates that are being looping over
    dateCursor = new Date(dateCursor.getTime() + MILLISECONDS_PER_DAY);
  }

  return newBookingsIndex;
};

export const bookingResolvers: IResolvers = {
  Mutation: {
    createBooking: async (
      _root: undefined,
      { input }: CreateBookingArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Booking> => {
      try {
        const { id, source, checkIn, checkOut } = input;
        const viewer = await authorize(db, req);

        if (!viewer) {
          throw new Error("Viewer cannot be found.");
        }

        const listing = await db.listings.findOne({
          _id: new ObjectId(id),
        });

        if (!listing) {
          throw new Error("Listing can't be found.");
        }

        if (listing.host === viewer._id) {
          throw new Error("Viewer can't book own listing.");
        }

        const today = new Date();
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (
          checkInDate.getTime() >
          today.getTime() + 180 * MILLISECONDS_PER_DAY
        ) {
          throw new Error(
            "Check in date can't be more than 180 days from today."
          );
        }

        if (
          checkOutDate.getTime() >
          today.getTime() + 180 * MILLISECONDS_PER_DAY
        ) {
          throw new Error(
            "Check out date can't be more than 180 days from today."
          );
        }

        if (checkOutDate < checkInDate) {
          throw new Error("Check out date can't be before check in date.");
        }

        const bookingsIndex = resolveBookingsIndex(
          listing.bookingsIndex,
          checkIn,
          checkOut
        );
        const totalPrice =
          listing.price *
          ((checkOutDate.getTime() - checkInDate.getTime()) /
            MILLISECONDS_PER_DAY +
            1);
        const host = await db.users.findOne({ _id: listing.host });

        if (!host || !host.walletId) {
          throw new Error(
            "The host either can't be found or is not connected with Stripe."
          );
        }

        await Stripe.charge(totalPrice, source, host.walletId);

        const insertRes = await db.bookings.insertOne({
          _id: new ObjectId(),
          listing: listing._id,
          tenant: viewer._id,
          checkIn,
          checkOut,
        });

        const insertedBooking: Booking = insertRes.ops[0];

        await db.users.updateOne(
          { _id: host._id },
          // Increment by total price
          { $inc: { income: totalPrice } }
        );
        await db.users.updateOne(
          { _id: viewer._id },
          // Add entry to bookings
          { $push: { bookings: insertedBooking._id } }
        );

        await db.listings.updateOne(
          { _id: listing._id },
          // Update bookings index of the listing this booking belongs to.
          // Add booking to bookings list of the listing this booking belongs to.
          { $set: { bookingsIndex }, $push: { bookings: insertedBooking._id } }
        );

        return insertedBooking;
      } catch (err) {
        throw new Error(`Failed to create a booking: ${err}`);
      }
    },
  },
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
    tenant: (
      booking: Booking,
      _args: unknown,
      { db }: { db: Database }
    ): Promise<User | null> => {
      return db.users.findOne({ _id: booking.tenant });
    },
  },
};
