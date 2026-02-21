import { useState } from "react";

function UsernameScreen({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError("Introduz um nome para continuar.");
      return;
    }
    if (trimmed.length < 2) {
      setError("O nome deve ter pelo menos 2 caracteres.");
      return;
    }
    setError("");
    onSubmit(trimmed);
  };

  return (
    <div className="username-screen" style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>🗺️</div>
        <h1 style={styles.title}>Map App</h1>
        <p style={styles.subtitle}>
          Vê as coordenadas de todos em tempo real. Começa por te identificar.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="O teu nome"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            autoFocus
            maxLength={30}
            style={styles.input}
            autoComplete="username"
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>
            Entrar no mapa
          </button>
        </form>
      </div>

      <p style={styles.footer}>Em breve será pedida permissão de localização</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background:
      "linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 40,
    background: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
    backdropFilter: "blur(12px)",
  },
  icon: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "white",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "0.95rem",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  input: {
    padding: "16px 20px",
    fontSize: "1rem",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "0.875rem",
    margin: "-8px 0 0",
  },
  button: {
    padding: "16px 24px",
    fontSize: "1rem",
    fontWeight: 600,
    color: "white",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.2s",
    boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
  },
  footer: {
    marginTop: 32,
    color: "rgba(255,255,255,0.4)",
    fontSize: "0.8rem",
  },
};

export default UsernameScreen;
