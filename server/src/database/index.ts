import { MongoClient } from "mongodb";
import { Booking, Database, User, Listing } from "../lib/types";

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}/test?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
  const mongoClient = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoClient.db("main");

  return {
    bookings: db.collection<Booking>("bookings"),
    listings: db.collection<Listing>("listings"),
    users: db.collection<User>("users"),
  };
};
