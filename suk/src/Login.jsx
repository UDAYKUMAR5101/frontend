import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!name || !gender || !age || !phone) {
      setError("Please fill in all fields.");
      return;
    }
    const payload = {
      name,
      gender,
      age: parseInt(age, 10),
      phone,
    };
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          console.error("Login API error:", res.status, data);
          const details = typeof data === "object" && data !== null
            ? Object.entries(data)
                .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
                .join(" | ")
            : "Invalid details";
          throw new Error(details || `Request failed (${res.status})`);
        }
        try {
          localStorage.setItem("user", JSON.stringify(data?.user || payload));
        } catch (_) {}
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate("/dashboard");
        }, 900);
      })
      .catch((err) => {
        setError(err.message || "Invalid details");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="login-box">
      <h2>Basic Details</h2>
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
          Details saved successfully
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
          <label>Gender</label>
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            placeholder="Male / Female / Other"
            required
          />
        </div>

        <div className="input-group">
          <label>Age</label>
          <input
            type="number"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern="[0-9]{10}"
            placeholder="Enter 10-digit number"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
