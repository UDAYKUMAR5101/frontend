import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function PatientSignin() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!name || !mobile) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/get-patient/?name=${encodeURIComponent(name.trim())}&phone=${encodeURIComponent(mobile.trim())}`, {
      method: "GET",
      headers: { "Accept": "application/json" },
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

        // Check if login was successful
        if (data && data.message === "Login successfully") {
          // Patient found - save to localStorage and navigate to dashboard
          try {
            localStorage.setItem("user", JSON.stringify({ name, phone: mobile }));
          } catch (_) {}
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            navigate("/diabetes");
          }, 900);
        } else {
          throw new Error(data?.message || "Patient not found");
        }
      })
      .catch((err) => {
        setError(err.message || "Patient lookup failed");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-box">
      <h2>Patient Sign In</h2>
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
          Patient found successfully
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
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Mobile Number</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            pattern="[0-9]{10}"
            placeholder="Enter 10-digit number"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default PatientSignin;
