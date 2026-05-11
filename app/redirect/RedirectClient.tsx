"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const WHATSAPP_PHONE = "5511999999999"; // fallback — override via ?phone=
const DELAY_MS = 3000;

// Paw print positions (deterministic so no hydration mismatch)
const PAWS = [
  { top: "8%",  left: "6%",  rotate: -20, size: 28, opacity: 0.18, delay: 0 },
  { top: "15%", left: "88%", rotate:  30, size: 22, opacity: 0.14, delay: 0.4 },
  { top: "30%", left: "3%",  rotate:  10, size: 18, opacity: 0.12, delay: 0.8 },
  { top: "52%", left: "93%", rotate: -35, size: 24, opacity: 0.16, delay: 1.2 },
  { top: "70%", left: "8%",  rotate:  25, size: 20, opacity: 0.13, delay: 0.6 },
  { top: "82%", left: "85%", rotate: -15, size: 26, opacity: 0.15, delay: 1.0 },
  { top: "90%", left: "45%", rotate:  40, size: 16, opacity: 0.10, delay: 1.6 },
];

function buildWhatsAppUrl(phone: string, text: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

function buildMessage(params: {
  hotel?: string;
  entrada?: string;
  saida?: string;
  message?: string;
}): string {
  if (params.message) return params.message;

  const lines: string[] = ["Olá! Gostaria de receber uma cotação 🐾"];
  if (params.hotel)   lines.push(`📍 Hotel: ${params.hotel}`);
  if (params.entrada) lines.push(`📅 Check-in: ${params.entrada}`);
  if (params.saida)   lines.push(`📅 Check-out: ${params.saida}`);
  return lines.join("\n");
}

export function RedirectClient() {
  const params  = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [done, setDone]         = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const phone   = params.get("phone")   ?? WHATSAPP_PHONE;
  const hotel   = params.get("hotel")   ?? undefined;
  const entrada = params.get("entrada") ?? undefined;
  const saida   = params.get("saida")   ?? undefined;
  const message = params.get("message") ?? undefined;

  const waUrl = buildWhatsAppUrl(phone, buildMessage({ hotel, entrada, saida, message }));

  // Date range label
  let dateLabel = "";
  if (entrada && saida)   dateLabel = `${entrada} → ${saida}`;
  else if (entrada)       dateLabel = `Check-in ${entrada}`;

  useEffect(() => {
    const start = performance.now();
    intervalRef.current = setInterval(() => {
      const elapsed = performance.now() - start;
      const p = Math.min((elapsed / DELAY_MS) * 100, 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(intervalRef.current!);
      }
    }, 16);

    timeoutRef.current = setTimeout(() => {
      setDone(true);
      window.location.href = waUrl;
    }, DELAY_MS);

    return () => {
      clearInterval(intervalRef.current!);
      clearTimeout(timeoutRef.current!);
    };
  }, [waUrl]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(160deg, #fff5f4 0%, #ffeaea 60%, #ffd4d4 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-nunito, system-ui, sans-serif)",
        position: "relative",
        overflow: "hidden",
        padding: "2rem 1.5rem",
      }}
    >
      {/* Floating paw prints */}
      {PAWS.map((p, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            fontSize: p.size,
            opacity: p.opacity,
            transform: `rotate(${p.rotate}deg)`,
            animation: `floatPaw 4s ease-in-out ${p.delay}s infinite alternate`,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          🐾
        </span>
      ))}

      {/* Card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "1.75rem",
          boxShadow: "0 8px 40px rgba(240,112,112,0.18)",
          padding: "2.5rem 2rem",
          maxWidth: "420px",
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Animated WhatsApp icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            fontSize: "2.25rem",
            boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
            animation: "pulse 1.8s ease-in-out infinite",
          }}
        >
          {done ? "✅" : "💬"}
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-fredoka, cursive)",
            fontSize: "1.6rem",
            fontWeight: 700,
            color: "#2c1810",
            margin: "0 0 0.5rem",
            lineHeight: 1.2,
          }}
        >
          {done ? "Abrindo WhatsApp…" : "Preparando sua cotação"}
        </h1>

        <p
          style={{
            fontSize: "0.9rem",
            color: "#8a6050",
            margin: "0 0 1.75rem",
            lineHeight: 1.5,
          }}
        >
          {done
            ? "Se não abrir automaticamente, clique no botão abaixo."
            : "Estamos montando sua mensagem com todos os detalhes da reserva. Um momento! 🐶"}
        </p>

        {/* Booking details pill */}
        {(hotel || dateLabel) && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "1.75rem",
            }}
          >
            {hotel && (
              <span
                style={{
                  background: "#fff5f4",
                  border: "1px solid #ffd4d4",
                  borderRadius: "9999px",
                  padding: "0.3rem 0.875rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#f07070",
                }}
              >
                📍 {hotel}
              </span>
            )}
            {dateLabel && (
              <span
                style={{
                  background: "#fff5f4",
                  border: "1px solid #ffd4d4",
                  borderRadius: "9999px",
                  padding: "0.3rem 0.875rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#f07070",
                }}
              >
                📅 {dateLabel}
              </span>
            )}
          </div>
        )}

        {/* Progress bar */}
        <div
          style={{
            height: "8px",
            background: "#ffeaea",
            borderRadius: "9999px",
            overflow: "hidden",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #f07070 0%, #25d366 100%)",
              borderRadius: "9999px",
              transition: "width 0.1s linear",
            }}
          />
        </div>

        <p
          style={{
            fontSize: "0.75rem",
            color: "#c4a090",
            marginBottom: "1.75rem",
          }}
        >
          {done ? "Pronto!" : `Redirecionando em instantes…`}
        </p>

        {/* CTA button */}
        <a
          href={waUrl}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
            color: "#fff",
            padding: "0.9rem 1.5rem",
            borderRadius: "0.875rem",
            fontWeight: 700,
            fontSize: "1rem",
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 22px rgba(37,211,102,0.4)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(37,211,102,0.3)";
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Abrir WhatsApp
        </a>

        {/* PitPet branding */}
        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "0.75rem",
            color: "#c4a090",
          }}
        >
          🐾 PitPet Store — Hotel para cães
        </p>
      </div>

      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(37,211,102,0.35); }
          50%       { transform: scale(1.08); box-shadow: 0 6px 28px rgba(37,211,102,0.5); }
        }
        @keyframes floatPaw {
          0%   { transform: rotate(var(--r, 0deg)) translateY(0px); }
          100% { transform: rotate(var(--r, 0deg)) translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
