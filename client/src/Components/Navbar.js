import React from "react";
import { Link } from "react-router-dom";
import {NavbarData} from './NavbarData';

const Navbar = () => {
  return (
    <div className="Sidebar">
      <p>CoSMo User Interface</p>
      <ul className="SidebarList">
        {NavbarData.map((val, key) => (
          <li key={key} className="Sidebar-row" id={window.location.pathname === val.link ? "active" : ""}>
            <Link to={val.link} className="SB-item">
              <div id="SB-icon">{val.icon}</div>
              <div id="SB-title">{val.title}</div>
            </Link>
          </li>
        ))}
      </ul>
     </div>
  );
};

export default Navbar;