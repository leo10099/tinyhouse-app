import React from "react";
import { List, Skeleton, Card } from "antd";

import listingLoadingCardCover from "../../assets/listing-loading-card-cover.jpg";

export const HomeListingsSkeleton = () => {
  const emptyData = [{}, {}, {}, {}]; // to have 4 items to pass into dataSource
  return (
    <div className="home-listings-skeleton">
      <Skeleton paragraph={{ rows: 0 }} />
      <List
        grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
        dataSource={emptyData}
        renderItem={() => (
          <List.Item>
            <Card
              cover={
                <div
                  style={{ backgroundImage: `urn(${listingLoadingCardCover})` }}
                  className="home-listings-skeleton__card-cover-img"
                />
              }
              loading
            />
          </List.Item>
        )}
      />
    </div>
  );
};
