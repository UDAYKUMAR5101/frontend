import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Symptoms from "./Symptoms";
import History from "./History";
import Dashboard from "./Dashboard";
import PatientSignin from "./PatientSignin";
import DiabetesPredictor from "./DiabetesPredictor";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/symptoms" element={<Symptoms />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient-signin" element={<PatientSignin />} />
        <Route path="/diabetes" element={<DiabetesPredictor />} />
      </Routes>
    </Router>
  );
}

export default App;
