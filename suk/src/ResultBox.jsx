import React from "react";

function ResultBox({ result = "Negative" }) {
  const normalized = String(result).toLowerCase();
  const isPositive = normalized === "positive";
  const title = isPositive ? "Positive" : "Negative";
  const message = isPositive
    ? "High risk detected."
    : "No need to consult doctor.";

  return (
    <div className={`result-box ${isPositive ? "positive" : "negative"}`}>
      <h3 className="result-title">{title}</h3>
      <p className="result-message">{message}</p>
    </div>
  );
}

export default ResultBox;


