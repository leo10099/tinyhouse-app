import React from "react";
import { UserProfile } from "./components";
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
  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: match.params.id,
    },
  });

  const user = data?.user;
  const viewerIsUser = viewer.id === match.params.id;

  const userProfileElement = user ? (
    <UserProfile viewerIsUser={viewerIsUser} user={user} />
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
      </Row>
    </Content>
  );
};
