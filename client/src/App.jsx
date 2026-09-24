import { useState } from "react";
import Navbar from "./conponts/Navbar";
import WavyBackground from "./conponts/Background";
import Landing from "./conponts/Landing";
import Signup from "./conponts/Signup";
// import Posts from "./conponts/posts";
import Idea from "./conponts/Idea";

import "./App.css";

function App() {
  return (
    <>
      <WavyBackground>
        <Navbar />
        {/* <Landing /> */}
        {/* <Signup /> */}
        {/* <Posts /> */}
        <Idea />
      </WavyBackground>
    </>
  );
}

export default App;
