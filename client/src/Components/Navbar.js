import React from "react";
import { Link } from "react-router-dom";
import {NavbarData} from './NavbarData';

const Navbar = () => {
  return (
    <div className="Sidebar">
      <p>CoSMo User Interface</p>
      <ul className="SidebarList">
         {NavbarData.map((val, key) =>{
            return(
              <li key={key} className="Sidebar-row" id={window.location.pathname==val.link ? "active":"" } onClick={()=> (window.location.pathname=val.link)}> 
                <div id="SB-icon">{val.icon}</div>
                <div id="SB-title">{val.title}</div>
              </li>
            )
        })}
      </ul>
     </div>


    // <nav className="navbar navbar-expand-lg navbar-expand-md navbar-dark bg-primary">
    //   <a className="navbar-brand" href="#">
    //     Navbar
    //   </a>
    //   <button
    //     className="navbar-toggler"
    //     type="button"
    //     data-toggle="collapse"
    //     data-target="#navbarNav"
    //     aria-controls="navbarNav"
    //     aria-expanded="false"
    //     aria-label="Toggle navigation"
    //   >
    //     <span className="navbar-toggler-icon"></span>
    //   </button>
    //   <div className="collapse navbar-collapse" id="navbarNav">
    //     <ul className="navbar-nav">
    //       <li className="nav-item active">
    //         <Link to="/">
    //           <div className={"nav-link"} href="#">
    //             Home
    //           </div>
    //         </Link>
    //       </li>
    //       <li className="nav-item">
    //         <Link to="/FlowTest">
    //           <div className={"nav-link"} href="/FlowTest">
    //             Flow
    //           </div>
    //         </Link>
    //       </li>
    //     </ul>
    //   </div>
    // </nav>
  );
};

export default Navbar;