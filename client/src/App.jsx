import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import AppRoute from "./conponts/Routes";
import { AuthProvider } from "./conponts/AuthContext";

// the chronicles of fnoch
import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>

          <AppRoute />
         
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
