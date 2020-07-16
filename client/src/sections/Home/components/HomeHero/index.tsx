import React from "react";
import { Link } from "react-router-dom";
import { Card, Col, Input, Row, Typography } from "antd";

import toronto from "../../assets/toronto.jpg";
import dubai from "../../assets/dubai.jpg";
import losAngeles from "../../assets/los-angeles.jpg";
import london from "../../assets/london.jpg";

const { Title } = Typography;
const { Search } = Input;

interface Props {
  onSearch: (value: string) => void;
}

export const HomeHero = ({ onSearch }: Props) => {
  return (
    <div className="home-hero">
      <div className="home-hero__search">
        <Title className="home-hero__title">
          Find a place you'll love to stay at
        </Title>
        <Search
          placeholder="San Francisco"
          size="large"
          enterButton
          className="home-hero__search-input"
          onSearch={onSearch}
        ></Search>
      </div>
      <Row gutter={12} className="home-hero__cards">
        <Col xs={12} md={6}>
          <Link to="/listings/toronto">
            <Card cover={<img alt="Toronto" src={toronto} />}>Toronto</Card>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <Link to="/listings/dubai">
            <Card cover={<img alt="Dubai" src={dubai} />}>Dubai</Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to="/listings/los%20angeles">
            <Card cover={<img alt="Los Angeles" src={losAngeles} />}>
              Los Angeles
            </Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to="/listings/london">
            <Card cover={<img alt="London" src={london} />}>London</Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};
