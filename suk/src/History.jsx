import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RiskLevel from "./RiskLevel";
import ResultBox from "./ResultBox";
import AdviceBox from "./AdviceBox";
import "./History.css";

function History() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const API_URL = 'https://0pjmxhbx-8000.inc1.devtunnels.ms/api/predict/';

  if (!state || typeof state.risk === "undefined" || !state.result) {
    navigate("/");
    return null;
  }

  const { risk: initialRisk, result: initialResult } = state;
  const [risk, setRisk] = useState(initialRisk);
  const [result, setResult] = useState(initialResult);

  useEffect(() => {
    // Try to fetch the most recent record from backend and refresh values
    fetch(API_URL, { method: 'GET', headers: { 'Accept': 'application/json' } })
      .then(async (res) => {
        const raw = await res.text();
        let data = [];
        try { data = raw ? JSON.parse(raw) : []; } catch (_) {}
        if (!res.ok || !Array.isArray(data) || data.length === 0) return;
        const latest = data[0];
        const percentStr = (latest?.risk_level || '').toString();
        const percent = percentStr.endsWith('%') ? Number(percentStr.replace('%','')) : Number(latest?.risk);
        if (!Number.isNaN(percent)) setRisk(Math.max(0, Math.min(100, Math.round(percent))));
        const pred = (latest?.prediction || latest?.result || '').toString();
        if (pred) setResult(/diabetic|positive/i.test(pred) ? 'Positive' : 'Negative');
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="history-page">
      <div className="history-header">
        <h2 className="history-title">History Overview</h2>
        <div className="history-actions">
          <button type="button" className="btn secondary" onClick={() => navigate("/diabetes")}>
            Back
          </button>
          <button type="button" className="btn danger" onClick={() => navigate("/patient-signin")}>
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
          <div style={{ height: 12 }} />
          <AdviceBox risk={risk} result={result} />
        </div>
      </div>
    </div>
  );
}

export default History;


