import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function AdminAlerts() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const [{ data: expiredVaccines }, { data: blockedAssessments }, { data: requiredServices }] =
    await Promise.all([
      // Expired or expiring vaccines with pet/tutor join
      supabase
        .from("vaccines")
        .select(`
          id, type, expires_at, status, proof_url,
          pets ( id, name, breed, tutors ( name, phone ) )
        `)
        .in("status", ["expired", "expiring_soon"])
        .order("expires_at", { ascending: true })
        .limit(50),

      // Blocked assessments
      supabase
        .from("assessments")
        .select(`
          id, status, risk_level, sanitary_score, sanitary_notes, created_at,
          pets ( id, name, breed, tutors ( name, phone ) )
        `)
        .eq("status", "BLOCKED")
        .order("created_at", { ascending: false })
        .limit(30),

      // Mandatory required services
      supabase
        .from("required_services")
        .select(`
          id, service_type, reason, price, mandatory,
          assessments ( status, pets ( name, tutors ( name, phone ) ) )
        `)
        .eq("mandatory", true)
        .limit(50),
    ]);

  const vaccineLabels: Record<string, string> = {
    rabies: "Raiva",
    v8v10: "V8/V10",
    kennel_cough: "Tosse dos Canis",
  };

  const serviceLabels: Record<string, string> = {
    flea_tick_treatment: "Tratamento Antipulgas/Carrapatos",
    nail_trimming: "Corte de Unhas",
    ear_cleaning: "Limpeza de Ouvidos",
    dental_brushing: "Escovação Dental",
    calming_spa: "Spa Relaxante",
    hydration_treatment: "Hidratação",
    photo_updates: "Atualizações por Foto",
    pre_checkout_bath: "Banho de Check-out",
    paw_hygiene: "Higiene das Patinhas",
    coat_brushing: "Escovação da Pelagem",
    wellness_check: "Check de Bem-Estar",
    wellbeing_report: "Relatório de Bem-Estar",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#2c1810]">Alertas Sanitários</h1>
        <p className="text-sm text-[#8a6050] mt-1">
          Vacinas vencidas, reservas bloqueadas e serviços obrigatórios
        </p>
      </div>

      {/* === Blocked reservations === */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="font-bold text-[#2c1810]">
            Reservas Bloqueadas ({blockedAssessments?.length ?? 0})
          </h2>
        </div>

        {blockedAssessments && blockedAssessments.length > 0 ? (
          <div className="space-y-3">
            {blockedAssessments.map((a) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const pet = (a as any).pets;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const tutor = pet?.tutors;
              return (
                <div
                  key={a.id}
                  className="rounded-2xl bg-red-50 border-2 border-red-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-red-800">
                        🚫 {pet?.name ?? "—"}
                        <span className="font-normal text-red-600 ml-1.5 text-sm">
                          ({pet?.breed ?? "raça não informada"})
                        </span>
                      </p>
                      <p className="text-sm text-red-700 mt-0.5">
                        {tutor?.name ?? "—"} ·{" "}
                        <a
                          href={`https://wa.me/55${tutor?.phone?.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {tutor?.phone ?? "—"}
                        </a>
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-200 text-red-800 flex-shrink-0">
                      Score {a.sanitary_score}/100
                    </span>
                  </div>
                  {(a.sanitary_notes as string[])?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {(a.sanitary_notes as string[]).map((n, i) => (
                        <li key={i} className="text-xs text-red-700">
                          {n}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            ✅ Nenhuma reserva bloqueada no momento.
          </div>
        )}
      </section>

      {/* === Vaccine alerts === */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <h2 className="font-bold text-[#2c1810]">
            Alertas de Vacinação ({expiredVaccines?.length ?? 0})
          </h2>
        </div>

        {expiredVaccines && expiredVaccines.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {expiredVaccines.map((v) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const pet = (v as any).pets;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const tutor = pet?.tutors;
                const isExpired = v.status === "expired";

                return (
                  <div key={v.id} className="px-5 py-4 flex items-center gap-4">
                    <span className={`text-xl flex-shrink-0 ${isExpired ? "opacity-100" : "opacity-70"}`}>
                      {isExpired ? "🔴" : "🟡"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2c1810]">
                        {pet?.name ?? "—"} —{" "}
                        <span className="text-[#8a6050] font-normal">
                          {vaccineLabels[v.type as string] ?? v.type}
                        </span>
                      </p>
                      <p className="text-xs text-[#8a6050] mt-0.5">
                        {tutor?.name ?? "—"} · {tutor?.phone ?? ""}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full
                          ${isExpired ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {isExpired ? "VENCIDA" : "VENCE EM BREVE"}
                      </span>
                      {v.expires_at && (
                        <p className="text-xs text-[#c09080] mt-1">
                          {new Date(v.expires_at).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            ✅ Todas as vacinas estão em dia.
          </div>
        )}
      </section>

      {/* === Mandatory services === */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#f07070]" />
          <h2 className="font-bold text-[#2c1810]">
            Serviços Obrigatórios Pendentes ({requiredServices?.length ?? 0})
          </h2>
        </div>

        {requiredServices && requiredServices.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {requiredServices.map((s) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const assessment = (s as any).assessments;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const pet = assessment?.pets;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const tutor = pet?.tutors;

                return (
                  <div key={s.id} className="px-5 py-4 flex items-start gap-4">
                    <span className="text-lg flex-shrink-0 mt-0.5">🛡️</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2c1810]">
                        {serviceLabels[s.service_type as string] ?? s.service_type}
                      </p>
                      <p className="text-xs text-[#8a6050] mt-0.5">
                        {pet?.name ?? "—"} · {tutor?.name ?? "—"}
                      </p>
                      {s.reason && (
                        <p className="text-xs text-[#c09080] mt-0.5 leading-relaxed">
                          {s.reason}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-[#f07070] flex-shrink-0">
                      {s.price ? `R$ ${Number(s.price).toFixed(2)}` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
            ✅ Nenhum serviço obrigatório pendente.
          </div>
        )}
      </section>
    </div>
  );
}
