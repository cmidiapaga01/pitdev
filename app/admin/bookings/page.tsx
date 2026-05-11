import { getBookings } from "@/app/actions/bookings";
import { BookingsTable } from "./BookingsTable";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  let bookings: Awaited<ReturnType<typeof getBookings>> = [];
  let error: string | null = null;

  try {
    bookings = await getBookings();
  } catch (e) {
    error = e instanceof Error ? e.message : "Erro ao carregar reservas.";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff5f4",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #f07070 0%, #e05555 100%)",
          color: "#fff",
          padding: "1.5rem 2rem",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🐾</span>
            <div>
              <h1 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>
                PitPet Store — Admin
              </h1>
              <p style={{ fontSize: "0.8rem", margin: 0, opacity: 0.85 }}>
                Gestão de Reservas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h2
              style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2c1810", margin: 0 }}
            >
              Reservas Pendentes
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#8a6050", marginTop: "0.25rem" }}>
              Clique em &quot;Gerar Link&quot; para criar o link personalizado de Pré-Check-In
              e enviar ao cliente pelo WhatsApp.
            </p>
          </div>
          <div
            style={{
              background: "#fff",
              border: "1px solid #ffd4d4",
              borderRadius: "0.75rem",
              padding: "0.5rem 1rem",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#f07070" }}>
              {bookings.length}
            </p>
            <p style={{ margin: 0, fontSize: "0.7rem", color: "#8a6050" }}>reservas</p>
          </div>
        </div>

        {error ? (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "0.75rem",
              padding: "1rem 1.5rem",
              color: "#dc2626",
            }}
          >
            ❌ {error}
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              border: "1px solid #ffd4d4",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <BookingsTable bookings={bookings} />
          </div>
        )}

        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.75rem",
            color: "#8a6050",
            textAlign: "center",
          }}
        >
          Os dados são atualizados em tempo real do Supabase.{" "}
          <a
            href="/admin/bookings"
            style={{ color: "#f07070", textDecoration: "underline" }}
          >
            Recarregar
          </a>
        </p>
      </div>
    </div>
  );
}
