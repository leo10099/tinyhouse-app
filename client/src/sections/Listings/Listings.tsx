import React, { FC } from "react";

// Api
import { server } from "../../lib/api";

// Types
import {
  ListingsData,
  DeleteListingData,
  DeleteListingVariables,
} from "./types";

// Custom Hooks
import { useQuery } from "../../lib/hooks";

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
  const { data, refetch } = useQuery<ListingsData>(LISTINGS);

  // Helpers
  const listings = data ? data.listings : null;

  const listOfListings = listings?.map((listing) => {
    return (
      <li key={listing.id}>
        {listing.title}
        <button onClick={() => deleteListing(listing.id)}>Delete</button>
      </li>
    );
  });

  const deleteListing = async (id: string) => {
    await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id,
      },
    });

    refetch();
  };

  return (
    <div>
      <h2>{title}</h2>
      <ul>{listOfListings}</ul>
    </div>
  );
};
