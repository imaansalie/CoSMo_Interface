import React, { useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";
import { LogIn } from './Components/LogIn';
import Navbar from "./Components/Navbar";
import PrivateRoute from './Components/PrivateRoute';
import ConstructorBuilder from './Components/ConstructorBuilder';
import ConstructorManager from './Components/ConstructorManager';
import UserManual from './Components/UserManual';


export const App = () => {
  
  const location = useLocation();
  const hideNavbar = location.pathname === "/";
  const toggleNavbarBool= useState(false);
  const [addedNodes, setAddedNodes] = useState([]);
  const [addedEdges, setAddedEdges] = useState([]);
  const [isNavbarVisible, setIsNavbarVisible] = useState(!toggleNavbarBool);

  const toggleNavbar = () => setIsNavbarVisible(prev => !prev);

  return (
    <div className="App">
      {!hideNavbar && (
        <div className={`Sidebar-container ${isNavbarVisible ? 'visible' : 'hidden'}`}>
          <Navbar 
            setIsNavbarVisible={setIsNavbarVisible}
          />
        </div>
      )}
      <button className={`hamburger-menu ${isNavbarVisible ? 'white' : 'black'}`} onClick={toggleNavbar}>
        ☰
      </button>
      <div className={`content ${isNavbarVisible? 'shrink' : 'expand'}`}>
      <Routes>
        <Route path="/" element={<LogIn setIsNavbarVisible={setIsNavbarVisible}/>} />
        <Route path="/ConstructorBuilder" element={
          <PrivateRoute>
            <ConstructorBuilder
              isNavbarVisible={isNavbarVisible}
              addedNodes={addedNodes}
              addedEdges={addedEdges}
              setAddedEdges={setAddedEdges}
              setAddedNodes={setAddedNodes}
            />
          </PrivateRoute>
        } />
        <Route path="/ConstructorManager" element={
          <PrivateRoute>
            <ConstructorManager
              addedNodes={addedNodes}
              addedEdges={addedEdges}
              setAddedEdges={setAddedEdges}
              setAddedNodes={setAddedNodes}
            />
          </PrivateRoute>
        } />
        <Route path="/UserManual" element={
          <PrivateRoute>
            <UserManual />
          </PrivateRoute>
        } />
      </Routes>
      </div>
    </div>
  );
};

