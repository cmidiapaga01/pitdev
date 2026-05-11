"use client";

import { useState, useTransition } from "react";
import { adminLogin } from "@/app/actions/admin-auth";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await adminLogin(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(160deg, #fff5f4 0%, #ffeaea 60%, #ffd4d4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-nunito, system-ui, sans-serif)",
        padding: "1.5rem",
      }}
    >
      {/* Paw decorations */}
      {[
        { top: "8%",  left: "5%",  rotate: -20, size: 30, opacity: 0.15 },
        { top: "12%", left: "90%", rotate:  25, size: 22, opacity: 0.12 },
        { top: "80%", left: "7%",  rotate:  15, size: 26, opacity: 0.13 },
        { top: "85%", left: "88%", rotate: -30, size: 20, opacity: 0.11 },
      ].map((p, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: "fixed",
            top: p.top,
            left: p.left,
            fontSize: p.size,
            opacity: p.opacity,
            transform: `rotate(${p.rotate}deg)`,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          🐾
        </span>
      ))}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "1.75rem",
          boxShadow: "0 8px 40px rgba(240,112,112,0.18)",
          padding: "2.5rem 2rem",
          width: "100%",
          maxWidth: "380px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f07070 0%, #e05555 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 1.25rem",
            boxShadow: "0 4px 16px rgba(240,112,112,0.3)",
          }}
        >
          🐾
        </div>

        <h1
          style={{
            fontFamily: "var(--font-fredoka, cursive)",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#2c1810",
            margin: "0 0 0.25rem",
          }}
        >
          PitPet Store
        </h1>
        <p style={{ fontSize: "0.82rem", color: "#8a6050", margin: "0 0 2rem" }}>
          Painel Administrativo
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Username */}
          <div style={{ textAlign: "left" }}>
            <label
              htmlFor="username"
              style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#5c3d30", marginBottom: "0.4rem" }}
            >
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              disabled={pending}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: `1.5px solid ${error ? "#f87171" : "#ffd4d4"}`,
                borderRadius: "0.75rem",
                fontSize: "0.95rem",
                color: "#2c1810",
                outline: "none",
                boxSizing: "border-box",
                background: "#fffafa",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ textAlign: "left" }}>
            <label
              htmlFor="password"
              style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#5c3d30", marginBottom: "0.4rem" }}
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={pending}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: `1.5px solid ${error ? "#f87171" : "#ffd4d4"}`,
                borderRadius: "0.75rem",
                fontSize: "0.95rem",
                color: "#2c1810",
                outline: "none",
                boxSizing: "border-box",
                background: "#fffafa",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "0.625rem",
                padding: "0.65rem 0.875rem",
                fontSize: "0.82rem",
                color: "#dc2626",
                textAlign: "left",
              }}
            >
              ❌ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: pending
                ? "#f0a0a0"
                : "linear-gradient(135deg, #f07070 0%, #e05555 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "0.875rem",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: pending ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(240,112,112,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "opacity 0.15s",
              opacity: pending ? 0.7 : 1,
            }}
          >
            {pending ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Entrando…
              </>
            ) : (
              "Entrar no Painel"
            )}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
