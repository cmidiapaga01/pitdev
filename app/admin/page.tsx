import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch aggregate stats
  const [
    { count: totalPets },
    { count: totalTutors },
    { count: blockedPets },
    { count: vaccinAlerts },
    { data: recentAssessments },
  ] = await Promise.all([
    supabase.from("pets").select("*", { count: "exact", head: true }),
    supabase.from("tutors").select("*", { count: "exact", head: true }),
    supabase
      .from("assessments")
      .select("*", { count: "exact", head: true })
      .eq("status", "BLOCKED"),
    supabase
      .from("vaccines")
      .select("*", { count: "exact", head: true })
      .in("status", ["expired", "expiring_soon"]),
    supabase
      .from("assessments")
      .select(`
        id, status, risk_level, sanitary_score, created_at,
        pets ( name, breed, tutors ( name, phone ) )
      `)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const stats = [
    { label: "Pets Cadastrados", value: totalPets ?? 0, icon: "🐶", color: "text-[#f07070]", bg: "bg-[#fff5f4]" },
    { label: "Tutores", value: totalTutors ?? 0, icon: "👤", color: "text-[#40d9c8]", bg: "bg-emerald-50" },
    { label: "Reservas Bloqueadas", value: blockedPets ?? 0, icon: "🚫", color: "text-red-500", bg: "bg-red-50" },
    { label: "Alertas de Vacina", value: vaccinAlerts ?? 0, icon: "💉", color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const statusConfig: Record<string, { label: string; color: string }> = {
    APPROVED: { label: "Aprovado", color: "bg-emerald-100 text-emerald-700" },
    APPROVED_WITH_WARNINGS: { label: "Com Obs.", color: "bg-amber-100 text-amber-700" },
    BLOCKED: { label: "Bloqueado", color: "bg-red-100 text-red-700" },
  };

  const riskConfig: Record<string, string> = {
    low: "text-emerald-600",
    medium: "text-amber-600",
    high: "text-orange-600",
    critical: "text-red-600",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2c1810]">Dashboard</h1>
        <p className="text-sm text-[#8a6050] mt-1">
          Visão geral do sistema de pré-check-in
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl ${s.bg} p-5 border border-white shadow-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-3xl font-bold ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-xs font-medium text-[#5c3d30]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { href: "/admin/alerts", label: "Ver Alertas Sanitários", icon: "🚨", color: "border-red-200 hover:bg-red-50" },
          { href: "/admin/pets", label: "Lista de Pets", icon: "🐶", color: "border-[#ffd4d4] hover:bg-[#fff5f4]" },
          { href: "/admin/tutors", label: "Lista de Tutores", icon: "👤", color: "border-[#ffd4d4] hover:bg-[#fff5f4]" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded-2xl border-2 ${link.color} px-4 py-3 text-sm font-medium text-[#2c1810] transition-all`}
          >
            <span className="text-xl">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Recent assessments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-[#2c1810]">Avaliações Recentes</h2>
          <Link href="/admin/pets" className="text-xs text-[#f07070] hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentAssessments && recentAssessments.length > 0 ? (
            recentAssessments.map((a) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const pet = (a as any).pets;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const tutor = pet?.tutors;
              const sc = statusConfig[a.status as string] ?? { label: a.status, color: "bg-gray-100 text-gray-600" };
              return (
                <div key={a.id} className="px-5 py-3.5 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#2c1810] truncate">
                      {pet?.name ?? "—"}
                      <span className="font-normal text-[#8a6050] ml-1.5 text-xs">
                        ({pet?.breed ?? "raça não informada"})
                      </span>
                    </p>
                    <p className="text-xs text-[#8a6050] mt-0.5 truncate">
                      {tutor?.name ?? "—"} · {tutor?.phone ?? ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${sc.color}`}>
                      {sc.label}
                    </span>
                    <span className={`text-xs font-bold ${riskConfig[a.risk_level as string] ?? "text-gray-500"}`}>
                      {a.sanitary_score}/100
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-5 py-8 text-center text-sm text-[#8a6050]">
              Nenhuma avaliação ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
