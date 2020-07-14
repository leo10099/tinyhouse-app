import React, { useState } from "react";
import { UserProfile, UserBookings, UserListings } from "./components";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { useQuery } from "@apollo/react-hooks";
import { USER } from "../../lib/graphql/queries";
import {
  User as UserData,
  UserVariables,
} from "../../lib/graphql/queries/User/__generated__/User";
import { RouteComponentProps } from "react-router-dom";

import { Col, Layout, Row } from "antd";
import { Viewer } from "../../lib/types";
const { Content } = Layout;
const PAGE_LIMIT = 4;
interface Props {
  viewer: Viewer;
}
interface MatchParams {
  id: string;
}

export const User = ({
  viewer,
  match,
}: Props & RouteComponentProps<MatchParams>) => {
  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);

  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: match.params.id,
      bookingsPage,
      listingsPage,
      limit: PAGE_LIMIT,
    },
  });

  const user = data?.user;
  const viewerIsUser = viewer.id === match.params.id;
  const userListings = user ? user.listings : null;
  const userBookings = user ? user.bookings : null;

  const userProfileElement = user ? (
    <UserProfile viewerIsUser={viewerIsUser} user={user} />
  ) : null;

  const userListingsElement = userListings ? (
    <UserListings
      userListings={userListings}
      listingsPage={listingsPage}
      limit={PAGE_LIMIT}
      setListingsPage={setListingsPage}
    ></UserListings>
  ) : null;
  const userBookingsElement = userBookings ? (
    <UserBookings
      userBookings={userBookings}
      bookingsPage={listingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    ></UserBookings>
  ) : null;

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton></PageSkeleton>
      </Content>
    );
  }
  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description="This user may no exist or we've encountered an error. Plsae try again soon"></ErrorBanner>
      </Content>
    );
  }

  return (
    <Content className="user">
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
        <Col xs={24}>{userListingsElement}</Col>
        <Col xs={24}>{userBookingsElement}</Col>
      </Row>
    </Content>
  );
};
