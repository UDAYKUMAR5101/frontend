import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Symptoms.css";

function Symptoms() {
  const navigate = useNavigate();

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [features, setFeatures] = useState({
    Polyuria: "No",
    Polydipsia: "No",
    sudden_weight_loss: "No",
    weakness: "No",
    Polyphagia: "No",
    Genital_thrush: "No",
    visual_blurring: "No",
    Itching: "No",
    Irritability: "No",
    delayed_healing: "No",
    partial_paresis: "No",
    muscle_stiffness: "No",
    Alopecia: "No",
    Obesity: "No",
  });

  const setFeature = (key, value) => {
    setFeatures((prev) => ({ ...prev, [key]: value }));
  };

  const computeRisk = () => {
    const symptomKeys = Object.keys(features);
    const numYes = symptomKeys.filter((k) => features[k] === "Yes").length;
    const basePercent = Math.round((numYes / symptomKeys.length) * 70);
    const ageBoost = Math.min(30, Math.max(0, (parseInt(age, 10) || 0) - 40));
    const obesityBoost = features.Obesity === "Yes" ? 10 : 0;
    const raw = basePercent + ageBoost + obesityBoost;
    return Math.max(0, Math.min(100, raw));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!age || !gender) {
      setError("Please fill Age and Gender.");
      return;
    }

    // Build payload using string values (backend expects strings per serializer errors)
    const normalizedGender = (gender || "").trim();
    const prettyGender = normalizedGender
      ? normalizedGender.charAt(0).toUpperCase() + normalizedGender.slice(1).toLowerCase()
      : normalizedGender;

    const payload = {
      Age: parseInt(age, 10),
      Gender: prettyGender,
      Polyuria: String(features.Polyuria),
      Polydipsia: String(features.Polydipsia),
      sudden_weight_loss: String(features.sudden_weight_loss),
      weakness: String(features.weakness),
      Polyphagia: String(features.Polyphagia),
      Genital_thrush: String(features.Genital_thrush),
      visual_blurring: String(features.visual_blurring),
      Itching: String(features.Itching),
      Irritability: String(features.Irritability),
      delayed_healing: String(features.delayed_healing),
      partial_paresis: String(features.partial_paresis),
      muscle_stiffness: String(features.muscle_stiffness),
      Alopecia: String(features.Alopecia),
      Obesity: String(features.Obesity),
    };

    setLoading(true);
    fetch("http://127.0.0.1:8000/api/predict/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const raw = await res.text();
        let data = {};
        try { data = raw ? JSON.parse(raw) : {}; } catch (_) {}
        if (!res.ok) {
          const details = data && typeof data === "object"
            ? Object.entries(data).map(([k,v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`).join(" | ")
            : (raw || `Request failed (${res.status})`);
          throw new Error(details);
        }

        // Flexible mapping: try several common response shapes, including percentage strings
        let risk = Number(data?.risk);
        if (Number.isNaN(risk) || typeof risk !== "number") {
          const percentStr = (data?.risk_level || "").toString().trim();
          const percentFromString = percentStr.endsWith("%") ? Number(percentStr.replace("%", "")) : NaN;
          const alt = Number.isNaN(percentFromString)
            ? Number(data?.risk_percent ?? data?.probability ?? data?.score)
            : percentFromString;
          risk = Number.isNaN(alt) ? computeRisk() : Math.round(alt);
        }
        risk = Math.max(0, Math.min(100, Math.round(risk)));

        const rawResult = (data?.result || data?.prediction || data?.label || "").toString();
        const result = /pos/i.test(rawResult) ? "Positive" : /neg/i.test(rawResult) ? "Negative" : (risk >= 50 ? "Positive" : "Negative");

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate("/history", {
            state: {
              age: parseInt(age, 10),
              gender,
              features,
              risk,
              result,
              backend: data,
            },
          });
        }, 900);
      })
      .catch((err) => {
        setError(err.message || "Prediction failed");
      })
      .finally(() => setLoading(false));
  };

  const YesNoToggle = ({ value, onChange, name }) => {
    const isYes = value === "Yes";
    return (
      <div className="segmented" role="radiogroup" aria-label={`${name} selection`}>
        <button
          type="button"
          className={`segmented-option ${!isYes ? "active" : ""}`}
          aria-pressed={!isYes}
          onClick={() => onChange("No")}
        >
          No
        </button>
        <button
          type="button"
          className={`segmented-option ${isYes ? "active" : ""}`}
          aria-pressed={isYes}
          onClick={() => onChange("Yes")}
        >
          Yes
        </button>
      </div>
    );
  };

  return (
    <div className="symptoms-page">
      <h2 className="symptoms-title">Symptoms</h2>
      {showToast && (
        <div style={{
          background: "#e8f5e9",
          color: "#2e7d32",
          padding: "8px 12px",
          borderRadius: "8px",
          marginBottom: "8px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          Prediction successful
        </div>
      )}
      {!!error && (
        <div style={{
          background: "#fde7e9",
          color: "#c62828",
          padding: "8px 12px",
          borderRadius: "8px",
          marginBottom: "8px",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="symptoms-top-grid">
          <div className="symptom-card">
            <label className="field-label">Age</label>
            <input
              className="field-input"
              type="number"
              min="0"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="symptom-card">
            <label className="field-label">Gender</label>
            <input
              className="field-input"
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="Male / Female / Other"
              required
            />
          </div>
        </div>

        <div className="symptoms-grid">
          <div className="symptom-card">
            <label className="field-label">Polyuria</label>
            <YesNoToggle
              name="Polyuria"
              value={features.Polyuria}
              onChange={(v) => setFeature("Polyuria", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Polydipsia</label>
            <YesNoToggle
              name="Polydipsia"
              value={features.Polydipsia}
              onChange={(v) => setFeature("Polydipsia", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Sudden Weight Loss</label>
            <YesNoToggle
              name="Sudden Weight Loss"
              value={features.sudden_weight_loss}
              onChange={(v) => setFeature("sudden_weight_loss", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Weakness</label>
            <YesNoToggle
              name="Weakness"
              value={features.weakness}
              onChange={(v) => setFeature("weakness", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Polyphagia</label>
            <YesNoToggle
              name="Polyphagia"
              value={features.Polyphagia}
              onChange={(v) => setFeature("Polyphagia", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Genital Thrush</label>
            <YesNoToggle
              name="Genital Thrush"
              value={features.Genital_thrush}
              onChange={(v) => setFeature("Genital_thrush", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Visual Blurring</label>
            <YesNoToggle
              name="Visual Blurring"
              value={features.visual_blurring}
              onChange={(v) => setFeature("visual_blurring", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Itching</label>
            <YesNoToggle
              name="Itching"
              value={features.Itching}
              onChange={(v) => setFeature("Itching", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Irritability</label>
            <YesNoToggle
              name="Irritability"
              value={features.Irritability}
              onChange={(v) => setFeature("Irritability", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Delayed Healing</label>
            <YesNoToggle
              name="Delayed Healing"
              value={features.delayed_healing}
              onChange={(v) => setFeature("delayed_healing", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Partial Paresis</label>
            <YesNoToggle
              name="Partial Paresis"
              value={features.partial_paresis}
              onChange={(v) => setFeature("partial_paresis", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Muscle Stiffness</label>
            <YesNoToggle
              name="Muscle Stiffness"
              value={features.muscle_stiffness}
              onChange={(v) => setFeature("muscle_stiffness", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Alopecia</label>
            <YesNoToggle
              name="Alopecia"
              value={features.Alopecia}
              onChange={(v) => setFeature("Alopecia", v)}
            />
          </div>

          <div className="symptom-card">
            <label className="field-label">Obesity</label>
            <YesNoToggle
              name="Obesity"
              value={features.Obesity}
              onChange={(v) => setFeature("Obesity", v)}
            />
          </div>
        </div>

        <div className="actions">
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Symptoms;


