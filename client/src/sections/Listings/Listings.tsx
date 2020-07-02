import React, { FC } from "react";
import { gql } from "apollo-boost";

// Types
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { Listings as ListingsData } from "./__generated__/Listings";

// Custom Hooks
import { useQuery, useMutation } from "react-apollo";

const LISTINGS = gql`
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

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
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
  const { data, refetch, loading, error } = useQuery<ListingsData>(LISTINGS);
  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingHasError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({
      variables: {
        id,
      },
    });
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

      {error ||
        deleteListingLoading ||
        (deleteListingHasError &&
          "Something went wrong. Please try again latter")}

      {!error && !deleteListingHasError && loading ? (
        <h2>Loading...</h2>
      ) : (
        <ul>{listOfListings}</ul>
      )}
    </div>
  );
};
