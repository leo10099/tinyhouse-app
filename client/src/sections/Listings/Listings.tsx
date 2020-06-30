import React, { FC } from "react";

// Api
import { server } from "../../lib/api";
// Types
import {
  ListingsData,
  DeleteListingData,
  DeleteListingVariables,
} from "./types";

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

const DELETE_LISTING = `
  mutation DeleteListing($id: ID!){
    deleteListing (id: $id) {
      id
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

  const deleteListing = async () => {
    const { data } = await server.fetch<
      DeleteListingData,
      DeleteListingVariables
    >({
      query: DELETE_LISTING,
      variables: {
        id: "5efa0cc4672f682bfcae915a",
      },
    });
    console.log(data);
  };

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={fetchListings}>Query Listings</button>
      <button onClick={deleteListing}>Delete a Listing</button>
    </div>
  );
};
