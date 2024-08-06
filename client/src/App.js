import './App.css';
import { useState } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Main} from './main-page'; 
import {ConstructorBuilder} from './ConstructorBuilder'; 
import Navbar from "./Components/Navbar";
import { Settings } from './Components/Settings';

export const App = () => {
  // const [selectedLanguage, setSelectedLanguage] = useState('English');
  return (
    <Router>
      <div className="App">
        <Navbar />
            <Routes>
              <Route path="/" element={<Main />}></Route>

              <Route 
                path="/ConstructorBuilder" 
                element={<ConstructorBuilder 
                  // selectedLanguage = {selectedLanguage}
                />}
              > 
                Flow 
              </Route>

              {/* <Route 
                path="/Settings" 
                element={<Settings 
                  selectedLanguage= {selectedLanguage}
                  setSelectedLanguage = {setSelectedLanguage}
                />}
              >  */}
                {/* Settings 
              </Route> */}
            </Routes>
      </div> 
    </Router>
  );
}

