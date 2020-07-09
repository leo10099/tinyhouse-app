import React from "react";
import { Alert } from "antd";

interface Props {
  message?: string;
  description?: string;
}

export const ErrorBanner: React.FC<Props> = ({
  message = "Uh oh! Something went wrong :(",
  description = "Looks like something went wrong. Prease check your connection and/or try again later",
}) => {
  return (
    <Alert
      banner
      className="error-banner"
      closable
      description={description}
      message={message}
      type="error"
    ></Alert>
  );
};
