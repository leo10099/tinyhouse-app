import React from "react";
import { Skeleton } from "antd";
import "./styles/ListingSkeleton.css";

interface Props {
  active: boolean;
  paragraph: any;
}

export const ListingsSkeleton = ({ active, paragraph }: Props) => {
  return (
    <div className="listings-skeleton">
      <Skeleton active={active} paragraph={paragraph}></Skeleton>
    </div>
  );
};
