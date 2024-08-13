import './App.css';
import { useContext, useState } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";
import { LogIn } from './Components/LogIn';
import {ConstructorBuilder} from './ConstructorBuilder'; 
import Navbar from "./Components/Navbar";
import { ConstructorManager } from './ConstructorManager';
import { UserContext } from './Contexts/UserContext';
import PrivateRoute from './Components/PrivateRoute';

export const App = () => {
  
  const location = useLocation();
  const hideNavbar = location.pathname === "/";
  const [addedNodes, setAddedNodes] = useState([]);
  const [addedEdges, setAddedEdges] = useState([]);

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
                element={
                  <PrivateRoute>
                    <ConstructorBuilder 
                    addedNodes= {addedNodes} 
                    addedEdges={addedEdges}
                    setAddedEdges = {setAddedEdges}
                    setAddedNodes = {setAddedNodes}
                  />
                  </PrivateRoute>
                }/> 

              <Route 
                path="/ConstructorManager" 
                element={
                  <PrivateRoute>
                    <ConstructorManager
                    addedNodes= {addedNodes} 
                    addedEdges={addedEdges}
                    setAddedEdges = {setAddedEdges}
                    setAddedNodes = {setAddedNodes}
                  />
                  </PrivateRoute>
                }/> 
            </Routes>
      </div> 
  );
}

