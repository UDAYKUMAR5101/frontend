import React from "react";

function AdviceBox({ risk = 0, result = "Negative" }) {
  const clamped = Math.max(0, Math.min(100, Number(risk) || 0));
  const isHigh = clamped >= 50 || String(result).toLowerCase() === "positive";

  const title = isHigh ? "Recommendation" : "All Good";
  const message = isHigh
    ? "Your risk is high. Please consult a doctor for further evaluation and personalized guidance."
    : "Low risk detected. Maintain a healthy lifestyle and monitor regularly.";

  return (
    <div className={`advice-box ${isHigh ? "warn" : "ok"}`}>
      <h3 className="advice-title">{title}</h3>
      <p className="advice-message">{message}</p>
      <ul className="advice-tips">
        {isHigh ? (
          <>
            <li>Schedule a checkup within the next 1–2 weeks.</li>
            <li>Track fasting glucose and stay hydrated.</li>
            <li>Aim for balanced meals and light daily activity.</li>
          </>
        ) : (
          <>
            <li>Stay active 30 minutes a day.</li>
            <li>Prefer whole grains, fruits, and vegetables.</li>
            <li>Get regular screenings as advised.</li>
          </>
        )}
      </ul>
    </div>
  );
}

export default AdviceBox;



