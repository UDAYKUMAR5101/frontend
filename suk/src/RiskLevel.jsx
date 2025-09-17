import React from "react";

function RiskLevel({ percent = 0 }) {
  const clamped = Math.max(0, Math.min(100, Number(percent) || 0));
  const gradient = `conic-gradient(var(--risk-color) ${clamped * 3.6}deg, #e6e6e6 0)`;

  return (
    <div className="risk-card" aria-label={`Risk level ${clamped}%`}>
      <div
        className="risk-circle"
        style={{ background: gradient }}
        role="img"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="risk-inner">
          <span className="risk-value">{clamped}%</span>
        </div>
      </div>
      <div className="risk-label">Risk Level</div>
    </div>
  );
}

export default RiskLevel;


