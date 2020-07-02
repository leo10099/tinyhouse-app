import React, { FC } from "react";
import { gql } from "apollo-boost";

// Components
import { Avatar, Button, Divider, List, Spin } from "antd";
import { ListingsSkeleton } from "./components";

// Types
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import { Listings as ListingsData } from "./__generated__/Listings";

// Custom Hooks
import { useQuery, useMutation } from "react-apollo";

// Styles
import "./styles/Listings.css";

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

  const listOfListings = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              onClick={() => handleDeleteListing(listing.id)}
              type="primary"
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          ></List.Item.Meta>
        </List.Item>
      )}
    />
  ) : null;

  return (
    <div className="listings">
      <h2>{title}</h2>

      {error ||
        deleteListingLoading ||
        (deleteListingHasError &&
          "Something went wrong. Please try again latter")}

      {!error && !deleteListingHasError && deleteListingLoading && (
        <Spin spinning={deleteListingLoading} />
      )}

      {!error && loading ? (
        <div className="listings">
          <ListingsSkeleton active paragraph={{ rows: 1 }} />
          <Divider></Divider>
          <ListingsSkeleton active paragraph={{ rows: 1 }} />
          <Divider></Divider>
          <ListingsSkeleton active paragraph={{ rows: 1 }} />
          <Divider></Divider>
        </div>
      ) : (
        <ul>{listOfListings}</ul>
      )}
    </div>
  );
};
