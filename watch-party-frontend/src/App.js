import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
import { React, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import LandingPage from "./components/LandingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    // <Home></Home>
    <Router>
      <Routes>
        <Route exact path="/"  element={<LandingPage/>} />
        <Route path="/room/:roomId" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;
