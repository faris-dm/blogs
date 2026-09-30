import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import WavyBackground from "./Background";
import Landing from "./Landing";
import Signup from "./Signup";
import NotFound from "./NotFound";
import ProtectedRoute from "./Protected";
import Splash from "./Splash";
import Footer from "./Footer.jsx";
import Profile from "./User.jsx";

import Idea from "./Idea";
import "../App.css";

function AppRoute() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <WavyBackground>
            <Splash>
              <Navbar />
              <Landing />
            </Splash>
          </WavyBackground>
        }
      />
      <Route
        path="/signup"
        element={
          <WavyBackground>
            <Navbar />
            <Signup />
            <Footer />
          </WavyBackground>
        }
      />
      <Route
        path="/post"
        element={
          <WavyBackground>
            <Navbar />
            <Idea />
            <Footer />
          </WavyBackground>
        }
      />
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <WavyBackground>
              <Navbar />
              <Profile />
              <Footer />
            </WavyBackground>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <WavyBackground>
            <NotFound />
          </WavyBackground>
        }
      />
    </Routes>
  );
}

export default AppRoute;
