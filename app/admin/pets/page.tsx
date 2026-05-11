import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AdminPets({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const { search, status } = await searchParams;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let query = supabase.from("assessments").select(`
    id, status, risk_level, sanitary_score, sanitary_notes, operational_notes, created_at,
    pets (
      id, name, breed, weight, gender, castrated, birth_date,
      tutors ( id, name, phone, email )
    )
  `).order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: assessments, error } = await query.limit(50);

  // Filter by search term (pet name or tutor name)
  const filtered = assessments?.filter((a) => {
    if (!search) return true;
    const s = search.toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pet = (a as any).pets;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tutor = pet?.tutors;
    return (
      pet?.name?.toLowerCase().includes(s) ||
      tutor?.name?.toLowerCase().includes(s) ||
      pet?.breed?.toLowerCase().includes(s)
    );
  });

  const statusConfig: Record<string, { label: string; badge: string }> = {
    APPROVED: { label: "Aprovado", badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    APPROVED_WITH_WARNINGS: { label: "Com Observações", badge: "bg-amber-100 text-amber-700 border-amber-200" },
    BLOCKED: { label: "Bloqueado", badge: "bg-red-100 text-red-700 border-red-200" },
  };

  const riskLabels: Record<string, string> = {
    low: "Baixo",
    medium: "Moderado",
    high: "Alto",
    critical: "Crítico",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2c1810]">Pets & Avaliações</h1>
        <p className="text-sm text-[#8a6050] mt-1">
          {filtered?.length ?? 0} pet{(filtered?.length ?? 0) !== 1 ? "s" : ""} encontrado{(filtered?.length ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3">
        <input
          name="search"
          defaultValue={search}
          placeholder="Buscar por pet ou tutor..."
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#2c1810] bg-white outline-none focus:ring-2 focus:ring-[#f07070]/30 focus:border-[#f07070]"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#2c1810] bg-white outline-none focus:ring-2 focus:ring-[#f07070]/30"
        >
          <option value="">Todos os status</option>
          <option value="APPROVED">Aprovados</option>
          <option value="APPROVED_WITH_WARNINGS">Com Observações</option>
          <option value="BLOCKED">Bloqueados</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#f07070] text-white font-medium text-sm hover:bg-[#d95050] transition-colors"
        >
          Filtrar
        </button>
        {(search || status) && (
          <Link
            href="/admin/pets"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#8a6050] hover:bg-gray-50 transition-colors"
          >
            Limpar
          </Link>
        )}
      </form>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Erro ao carregar dados: {error.message}
        </div>
      )}

      {/* Pet cards */}
      <div className="space-y-3">
        {filtered && filtered.length > 0 ? (
          filtered.map((assessment) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pet = (assessment as any).pets;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tutor = pet?.tutors;
            const sc = statusConfig[assessment.status as string];
            const isBlocked = assessment.status === "BLOCKED";

            return (
              <div
                key={assessment.id}
                className={`rounded-2xl bg-white border-2 shadow-sm p-5 transition-all
                  ${isBlocked ? "border-red-200" : "border-gray-100 hover:border-[#ffd4d4]"}`}
              >
                <div className="flex items-start gap-4 flex-wrap">
                  {/* Pet info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-[#2c1810] text-lg">
                        {pet?.name ?? "—"}
                      </h3>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${sc?.badge ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {sc?.label ?? assessment.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#8a6050] mt-0.5">
                      {pet?.breed ?? "Raça não informada"} ·{" "}
                      {pet?.weight ? `${pet.weight} kg` : "Peso não informado"} ·{" "}
                      {pet?.gender === "male" ? "Macho" : pet?.gender === "female" ? "Fêmea" : "—"}
                      {pet?.castrated ? " · Castrado" : ""}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span className="text-[#5c3d30] font-medium">{tutor?.name ?? "—"}</span>
                      <span className="text-[#c09080]">·</span>
                      <a href={`tel:${tutor?.phone}`} className="text-[#40d9c8] hover:underline">
                        {tutor?.phone ?? "—"}
                      </a>
                    </div>
                  </div>

                  {/* Score & risk */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-3xl font-bold text-[#f07070]">
                      {assessment.sanitary_score}
                      <span className="text-base font-normal text-[#c09080]">/100</span>
                    </div>
                    <p className="text-xs text-[#8a6050] mt-0.5">
                      Risco {riskLabels[assessment.risk_level as string] ?? assessment.risk_level}
                    </p>
                  </div>
                </div>

                {/* Sanitary notes */}
                {(assessment.sanitary_notes as string[])?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-[#5c3d30] mb-1.5">
                      Notas Sanitárias:
                    </p>
                    <ul className="space-y-1">
                      {(assessment.sanitary_notes as string[]).map((note, i) => (
                        <li key={i} className="text-xs text-[#8a6050] leading-relaxed">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Operational notes */}
                {(assessment.operational_notes as string[])?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-[#5c3d30] mb-1.5">
                      Notas Operacionais:
                    </p>
                    <ul className="space-y-1">
                      {(assessment.operational_notes as string[]).map((note, i) => (
                        <li key={i} className="text-xs text-[#8a6050] leading-relaxed">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs text-[#c09080] mt-3">
                  Avaliado em{" "}
                  {new Date(assessment.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl bg-white border border-gray-100 px-5 py-12 text-center">
            <p className="text-[#8a6050] text-sm">
              Nenhum pet encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
