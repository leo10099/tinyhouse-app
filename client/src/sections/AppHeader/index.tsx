import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Layout, Input } from "antd";
import { MenuItems } from "./components";
import logo from "./assets/tinyhouse-logo.png";
import { displayErrorMessage } from "../../lib/utils";
import { Viewer } from "../../lib/types";

const { Header } = Layout;
const { Search } = Input;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const AppHeader: React.FC<Props> = ({ setViewer, viewer }) => {
  const history = useHistory();
  const location = useLocation();
  const [search, setSearch] = useState("");

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage("Please enter a valid search");
    }
  };

  useEffect(() => {
    const { pathname } = location;
    const pathnameSubStrings = pathname.split("/");

    if (!pathname.includes("/listings")) {
      setSearch("");
      return;
    }

    if (pathname.includes("/listings") && pathname.length === 3) {
      setSearch(pathnameSubStrings[2]);
      return;
    }
  }, [location]);

  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link to="/">
            <img src={logo} alt="App logo" />
          </Link>
        </div>
        <div className="app-header__search-input">
          <Search
            placeholder="San Francisco"
            enterButton
            onSearch={onSearch}
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
          ></Search>
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  );
};
