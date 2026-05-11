"use client";

import { useState, useTransition } from "react";
import { generatePrecheckinToken } from "@/app/actions/bookings";

interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  nights: number;
  weight_label: string;
  subtotal: number;
  status: string;
  precheckin_token: string | null;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  pending_form: "Aguardando link",
  form_sent: "Link enviado",
  submitted: "Formulário enviado",
  confirmed: "Confirmado",
};

const STATUS_COLOR: Record<string, string> = {
  pending_form: "#f59e0b",
  form_sent: "#3b82f6",
  submitted: "#10b981",
  confirmed: "#6366f1",
};

function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const [links, setLinks] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  function handleGenerate(bookingId: string) {
    setLoadingId(bookingId);
    startTransition(async () => {
      const result = await generatePrecheckinToken(bookingId);
      setLoadingId(null);
      if (result.success) {
        setLinks((prev) => ({ ...prev, [bookingId]: result.url }));
      } else {
        alert(`Erro: ${result.error}`);
      }
    });
  }

  function handleCopy(bookingId: string, url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(bookingId);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  if (bookings.length === 0) {
    return (
      <p style={{ color: "#8a6050", textAlign: "center", padding: "3rem" }}>
        Nenhuma reserva ainda. As reservas aparecerão aqui quando os clientes
        preencherem a cotação no site.
      </p>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ffd4d4", textAlign: "left" }}>
            {["Data", "Check-in", "Check-out", "Noites", "Porte", "Total", "Status", "Ação"].map((h) => (
              <th
                key={h}
                style={{ padding: "0.75rem 1rem", color: "#5c3d30", fontWeight: 600 }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const generatedUrl = links[b.id] ?? (b.precheckin_token
              ? `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/pre-checkin?t=${b.precheckin_token}`
              : null);

            return (
              <tr
                key={b.id}
                style={{ borderBottom: "1px solid #ffeaea" }}
              >
                <td style={{ padding: "0.75rem 1rem", color: "#8a6050" }}>
                  {formatDate(b.created_at.split("T")[0])}
                </td>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>
                  {formatDate(b.check_in)}
                </td>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 500 }}>
                  {formatDate(b.check_out)}
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>{b.nights}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#5c3d30" }}>
                  {b.weight_label}
                </td>
                <td style={{ padding: "0.75rem 1rem", fontWeight: 600, color: "#f07070" }}>
                  R$ {Number(b.subtotal).toFixed(2)}
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: `${STATUS_COLOR[b.status]}22`,
                      color: STATUS_COLOR[b.status],
                    }}
                  >
                    {STATUS_LABEL[b.status] ?? b.status}
                  </span>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  {generatedUrl ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        readOnly
                        value={generatedUrl}
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.25rem 0.5rem",
                          border: "1px solid #ffd4d4",
                          borderRadius: "0.375rem",
                          width: "200px",
                          color: "#5c3d30",
                        }}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                      />
                      <button
                        onClick={() => handleCopy(b.id, generatedUrl)}
                        style={{
                          padding: "0.25rem 0.75rem",
                          backgroundColor: copied === b.id ? "#10b981" : "#f07070",
                          color: "#fff",
                          border: "none",
                          borderRadius: "0.375rem",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {copied === b.id ? "✓ Copiado!" : "Copiar"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleGenerate(b.id)}
                      disabled={loadingId === b.id || pending}
                      style={{
                        padding: "0.375rem 0.875rem",
                        backgroundColor: loadingId === b.id ? "#e5e7eb" : "#f07070",
                        color: loadingId === b.id ? "#6b7280" : "#fff",
                        border: "none",
                        borderRadius: "0.5rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        cursor: loadingId === b.id ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {loadingId === b.id ? "Gerando..." : "🔗 Gerar Link"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
