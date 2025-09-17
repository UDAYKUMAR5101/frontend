import React from "react";
import { useNavigate } from "react-router-dom";
import RiskLevel from "./RiskLevel";
import "./History.css";

function Profile() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (_) {}
  if (!user) return null;
  return (
    <div className="result-box" style={{ marginBottom: 16 }}>
      <h3 className="result-title">Profile</h3>
      <p className="result-message">Name: {user.name}</p>
      <p className="result-message">Gender: {user.gender}</p>
      <p className="result-message">Age: {user.age}</p>
      <p className="result-message">Phone: {user.phone}</p>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="history-page">
      <div className="history-header">
        <h2 className="history-title">Dashboard</h2>
        <div className="history-actions">
          <button className="btn secondary" onClick={() => navigate("/symptoms")}>Symptoms</button>
          <button className="btn" onClick={() => navigate("/history")}>History</button>
          <button className="btn danger" onClick={() => navigate("/")}>Logout</button>
        </div>
      </div>
      <div className="history-grid">
        <div className="history-left">
          <RiskLevel percent={50} />
        </div>
        <div className="history-right">
          <Profile />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


