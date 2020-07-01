import React, { FC } from "react";

// Types
import {
  ListingsData,
  DeleteListingData,
  DeleteListingVariables,
} from "./types";

// Custom Hooks
import { useQuery, useMutation } from "../../lib/hooks";

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
  // Hooks
  const { data, refetch, loading, hasError } = useQuery<ListingsData>(LISTINGS);
  const [
    deleteListing,
    { loading: deleteListingLoading, hasError: deleteListingHasError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ id });
    refetch();
  };

  // Helpers
  const listings = data ? data.listings : null;

  const listOfListings = listings?.map((listing) => {
    return (
      <li key={listing.id}>
        {listing.title}
        <button onClick={() => handleDeleteListing(listing.id)}>Delete</button>
      </li>
    );
  });

  return (
    <div>
      <h2>{title}</h2>

      {hasError ||
        deleteListingLoading ||
        (deleteListingHasError &&
          "Something went wrong. Please try again latter")}

      {!hasError && !deleteListingHasError && loading ? (
        <h2>Loading...</h2>
      ) : (
        <ul>{listOfListings}</ul>
      )}
    </div>
  );
};
