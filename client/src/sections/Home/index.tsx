import React from "react";
import { useQuery } from "@apollo/react-hooks";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { LISTINGS } from "../../lib/graphql/queries/Listings";
import { Col, Row, Layout, Typography } from "antd";
import { Link, RouteComponentProps } from "react-router-dom";
import { displayErrorMessage } from "../../lib/utils";
import { HomeHero, HomeListings, HomeListingsSkeleton } from "./components";

import mapBackground from "./assets/map-background.jpg";
import sanFrancisco from "./assets/san-fransisco.jpg";
import cancun from "./assets/cancun.jpg";

const { Content } = Layout;
const { Paragraph, Title } = Typography;

const PAGE_LIMIT = 4;
const PAGE_NUMBER = 1;

export const Home = ({ history }: RouteComponentProps) => {
  const { loading, data } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        filter: ListingsFilter.PRICE_HIGH_TO_LOW,
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
      },
    }
  );

  const onSearch = (value: string) => {
    const trimmed = value.trim();
    if (trimmed) {
      history.push(`/listings/${trimmed}`);
    } else {
      displayErrorMessage("Please enter a valid search");
    }
  };

  const renderListingsSection = () => {
    if (loading) {
      return <HomeListingsSkeleton />;
    }

    if (data) {
      return (
        <HomeListings
          title="Premium Listings"
          listings={data.listings.result}
        />
      );
    }

    return null;
  };

  return (
    <Content
      className="home"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <HomeHero onSearch={onSearch} />

      <div className="home__cta-section">
        <Title level={2} className="home__cta-section-title">
          Your guide for all things rental
        </Title>
        <Paragraph>
          Helping you make the best decisions in all things rental
        </Paragraph>
        <Link
          to="/listings/united%20states"
          className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button"
        >
          Popular listings in the United States
        </Link>
      </div>

      {renderListingsSection()}

      <div className="home__listings">
        <Title level={4} className="home__listings-title">
          Listings of any kind
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to="/listings/san%20francisco">
              <div className="home__listings-img-cover">
                <img
                  alt="San Francisco"
                  src={sanFrancisco}
                  className="home__listings-img"
                ></img>
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to="/listings/cancún">
              <div className="home__listings-img-cover">
                <img
                  alt="Cancún"
                  src={cancun}
                  className="home__listings-img"
                ></img>
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  );
};
