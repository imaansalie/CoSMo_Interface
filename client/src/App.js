import './App.css';
import { useState } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Main} from './main-page'; 
import {ConstructorBuilder} from './ConstructorBuilder'; 
import Navbar from "./Components/Navbar";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
            <Routes>
              <Route path="/" element={<Main />}></Route>
              <Route path="/ConstructorBuilder" element={<ConstructorBuilder />}> Flow </Route>
            </Routes>
      </div> 
    </Router>
  );
}

export default App;
