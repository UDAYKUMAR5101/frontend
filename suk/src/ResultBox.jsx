import React from "react";

function ResultBox({ result = "Negative" }) {
  const isPositive = String(result).toLowerCase() === "positive";
  const title = isPositive ? "Positive" : "Negative";
  const message = isPositive
    ? "High risk detected – Please consult a doctor."
    : "Low risk – No immediate consultation required.";

  return (
    <div className={`result-box ${isPositive ? "positive" : "negative"}`}>
      <h3 className="result-title">{title}</h3>
      <p className="result-message">{message}</p>
    </div>
  );
}

export default ResultBox;


