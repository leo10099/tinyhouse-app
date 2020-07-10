import React from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { LOG_OUT } from "../../../../lib/graphql/mutations";
import { LogOut as LogOutData } from "../../../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { Avatar, Button, Menu } from "antd";
import { HomeOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Viewer } from "../../../../lib/types";
import {
  displaySuccessNotification,
  displayErrorMesage,
} from "../../../../lib/utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const MenuItems: React.FC<Props> = ({ setViewer, viewer }) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (result) => {
      if (result?.logOut) {
        setViewer(result.logOut);
        sessionStorage.removeItem("token");
        displaySuccessNotification("You've successfully logged out");
      }
    },
    onError: (_error) => {
      displayErrorMesage(
        "Sorry! We weren't able to log you out. Please try again"
      );
    },
  });

  const handleLogout = () => logOut();

  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <Menu.SubMenu title={<Avatar src={viewer.avatar}></Avatar>}>
        <Menu.Item key="/user">
          <Link to="/user">
            <UserOutlined />
            Profile
          </Link>
        </Menu.Item>
        <Menu.Item key="/logout">
          <div onClick={handleLogout}>
            <LogoutOutlined />
            Log Out
          </div>
        </Menu.Item>
      </Menu.SubMenu>
    ) : (
      <Menu.Item>
        <Link to="/login">
          <Button type="primary">Sign In </Button>
        </Link>
      </Menu.Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Menu.Item key="/host">
        <Link to="/host">
          <HomeOutlined />
          Host
        </Link>
      </Menu.Item>
      {subMenuLogin}
    </Menu>
  );
};
