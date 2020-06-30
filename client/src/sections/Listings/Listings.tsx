import React, { FC } from "react";

// Api
import { server } from "../../lib/api";
// Types
import { ListingsData } from "./types";

const LISTINGS = `
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

interface ListingsProps {
  title: string;
}

export const Listings: FC<ListingsProps> = ({
  title,
}: ListingsProps): JSX.Element => {
  // Handlers
  const fetchListings = async () => {
    const listings = await server.fetch<ListingsData>({ query: LISTINGS });
    console.log(listings);
  };

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={fetchListings}>Query Listings</button>
    </div>
  );
};
