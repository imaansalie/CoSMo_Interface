import './App.css';
import { useContext, useState } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";
import { LogIn } from './Components/LogIn';
import {ConstructorBuilder} from './ConstructorBuilder'; 
import Navbar from "./Components/Navbar";
import { ConstructorManager } from './ConstructorManager';
import { UserContext } from './Contexts/UserContext';

export const App = () => {
  
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
      <div className="App">
        {!hideNavbar && <Navbar />}
            <Routes>
              <Route 
                path="/" 
                element={
                <LogIn />}>
              </Route>

              <Route 
                path="/ConstructorBuilder" 
                element={<ConstructorBuilder/>}> 
                Flow 
              </Route>

              <Route 
                path="/ConstructorManager" 
                element={
                <ConstructorManager/>}> 
                Constructor Manager 
              </Route>
            </Routes>
      </div> 
  );
}

