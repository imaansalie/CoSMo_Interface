import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {NavbarData} from './NavbarData';
import { UserContext } from "../Contexts/UserContext";
import { useContext } from "react";

const Navbar = ({setIsNavbarVisible}) => {

  const {setUserID, setUsername, setPassword} = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
    
  const handleLogout = (val) =>{
    if(val.title === 'Log Out'){
      setUserID('');
      setUsername('');
      setPassword('');
      localStorage.removeItem('userID');
      localStorage.removeItem('username');
      navigate('/');  // Redirect to login page
      setIsNavbarVisible(false);
    }
  }

  return (
    <div className="Sidebar">
      <p style={{marginBottom:"10px", marginTop:"30px"}}>CoSMo Studio</p>
      <ul className="SidebarList">
        {NavbarData.map((val, key) => (
          <li 
            key={key} 
            className={`Sidebar-row ${location.pathname === val.link ? "active" : ""}`}
          >
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