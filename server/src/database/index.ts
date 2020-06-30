import { MongoClient } from "mongodb";
import { Database } from "../lib/types";

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}/test?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
  const mongoClient = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoClient.db("main");

  return {
    listings: db.collection("test_listings"),
  };
};
