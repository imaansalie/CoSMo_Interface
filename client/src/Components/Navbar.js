import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {NavbarData} from './NavbarData';
import { UserContext } from "../Contexts/UserContext";
import { useContext } from "react";

const Navbar = () => {

  const {setUserID} = useContext(UserContext);
  const navigate = useNavigate();
    
  const handleLogout = (val) =>{
    if(val.title === 'Log Out'){
      setUserID(null);
      navigate('/');
    }
  }

  return (
    <div className="Sidebar">
      <p>CoSMo User Interface</p>
      <ul className="SidebarList">
        {NavbarData.map((val, key) => (
          <li key={key} className="Sidebar-row" id={window.location.pathname === val.link ? "active" : ""}>
            <Link onClick = {()=>handleLogout(val)} to={val.link} className="SB-item">
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