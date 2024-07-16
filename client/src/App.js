import './App.css';
import { useState } from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Main} from './main-page'; 
import {FlowTest} from './FlowTest'; 
import Navbar from "./Navbar";

function App() {

  // const [name, setName] = useState("")
  // const [password, setPassword] = useState("")

  // const addUser = () => {
  //   axios.post("http://localhost:3001/create", {
  //     name: name, 
  //     password: password,
  //   }).then(() => {
  //     console.log("sent");
  //   });
  // };

  return (
    <Router>
      <div className="App">
        <Navbar />
            <Routes>
              <Route path="/" element={<Main />}></Route>
              <Route path="/FlowTest" element={<FlowTest />}> Flow </Route>
            </Routes>
      </div> 
    </Router>
  );
}

export default App;
