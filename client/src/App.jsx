import { useState } from "react";
import { BrowserRouter, Router, Route, Routes } from "react-router-dom";
import Navbar from "./conponts/Navbar";
import WavyBackground from "./conponts/Background";
import Landing from "./conponts/Landing";
import Signup from "./conponts/Signup";
// import Reacts from "./conponts/Reacts";
import Profile from "./conponts/profile";
import NotFound from "./conponts/NotFound";
import Idea from "./conponts/Idea";
import AppRoute from "./conponts/Routes";
import { AuthProvider } from "./conponts/AuthContext";
import Splash from "./conponts/Splash";
import Footer from "./conponts/Footer.jsx";
// the chronicles of fnoch
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          {/* <Splash> */}
          <AppRoute />
          {/* </Splash> */}
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
