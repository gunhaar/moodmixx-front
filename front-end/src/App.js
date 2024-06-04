import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import Switch from "react-ios-switch";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Advanced from "./Advanced";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/content" element={<Advanced />} />
    </Routes>
  );
}

export default App;
