import React, { useEffect, useRef } from "react";
import { Card, Layout, Spin, Typography } from "antd";
import googleLogo from "./assets/google_logo.jpg";
import { Viewer } from "../../lib/types";
import { useApolloClient, useMutation } from "react-apollo";
import { AUTH_URL } from "../../lib/graphql/queries";
import { AuthUrl as AuhtUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import {
  LogIn as LoginData,
  LogInVariables,
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { LOG_IN } from "../../lib/graphql/mutations";
import { ErrorBanner } from "../../lib/components";
import {
  displaySuccessNotification,
  displayErrorMesage,
} from "../../lib/utils";
import { Redirect } from "react-router-dom";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const LogIn: React.FC<Props> = ({ setViewer }: Props) => {
  const client = useApolloClient();
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError },
  ] = useMutation<LoginData, LogInVariables>(LOG_IN, {
    onCompleted: (result) => {
      if (result?.logIn) {
        setViewer(result.logIn);
        displaySuccessNotification("You've successfully logged in ");
      }
    },
  });
  const logInRef = useRef(logIn);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query({
        query: AUTH_URL,
      });
      window.location.href = data.authUrl;
    } catch {
      displayErrorMesage(
        "Sorry! We weren't able to log you in. Please try again later."
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..."></Spin>
      </Content>
    );
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later."></ErrorBanner>
  ) : null;

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Redirect to={`/user/${viewerId}`}></Redirect>;
  }

  return (
    <Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-tile">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-tile">
            Log in to Tinyhouse!
          </Title>
        </div>
        <button
          className="log-in-card__google-button"
          onClick={handleAuthorize}
        >
          <img
            src={googleLogo}
            alt="Googel Logo"
            className="log-in-card__google-button-logo"
          ></img>
          <span className="log-in-card__google-button-text">Sign in</span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google account.
        </Text>
      </Card>
    </Content>
  );
};
