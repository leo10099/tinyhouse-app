import { Collection, ObjectId } from "mongodb";

export interface Viewer {
  _id?: string;
  token?: string;
  avatar?: string;
  walletId?: string;
  didRequestGoogleInfo: boolean;
}

export enum ListingType {
  Apartment = "APARTMENT",
  House = "HOUSE",
}
export interface BookingsIndexMonth {
  [key: string]: boolean;
}

export interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth;
}

export interface BookingsIndex {
  [key: string]: BookingsIndexYear;
}

export interface Booking {
  _id: ObjectId;
  listing: ObjectId;
  tenant: string;
  checkIn: string;
  checkOut: string;
}

export interface Listing {
  _id: ObjectId;
  description: string;
  host: string;
  type: ListingType;
  title: string;
  image: string;
  admin: string;
  city: string;
  address: string;
  country: string;
  price: number;
  numOfGuests: number;
  bookings: ObjectId[];
  bookingsIndex: BookingsIndex;
}

export interface User {
  _id: string;
  token: string;
  name: string;
  avatar: string;
  contact: string;
  walletId?: string;
  income: number;
  bookings: ObjectId[];
  listings: ObjectId[];
  authorized?: boolean;
}

export interface Database {
  bookings: Collection<Booking>;
  listings: Collection<Listing>;
  users: Collection<User>;
}
