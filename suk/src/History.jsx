import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RiskLevel from "./RiskLevel";
import ResultBox from "./ResultBox";
import "./History.css";

function History() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state || typeof state.risk === "undefined" || !state.result) {
    navigate("/");
    return null;
  }

  const { risk, result } = state;

  return (
    <div className="history-page">
      <div className="history-header">
        <h2 className="history-title">History Overview</h2>
        <div className="history-actions">
          <button type="button" className="btn secondary" onClick={() => navigate("/symptoms")}>
            Back
          </button>
          <button type="button" className="btn danger" onClick={() => navigate("/")}>
            Logout
          </button>
        </div>
      </div>
      <div className="history-grid">
        <div className="history-left">
          <RiskLevel percent={risk} />
        </div>
        <div className="history-right">
          <ResultBox result={result} />
        </div>
      </div>
    </div>
  );
}

export default History;


