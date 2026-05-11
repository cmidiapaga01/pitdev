import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function AdminTutors({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: tutors, error } = await supabase
    .from("tutors")
    .select(`
      id, name, phone, email, emergency_contact, created_at,
      pets ( id, name, breed, assessments ( status, sanitary_score ) )
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  const filtered = tutors?.filter((t) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      t.name?.toLowerCase().includes(s) ||
      t.phone?.includes(s) ||
      t.email?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2c1810]">Tutores</h1>
        <p className="text-sm text-[#8a6050] mt-1">
          {filtered?.length ?? 0} tutor{(filtered?.length ?? 0) !== 1 ? "es" : ""} cadastrado{(filtered?.length ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-3">
        <input
          name="search"
          defaultValue={search}
          placeholder="Buscar por nome, telefone ou e-mail..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#2c1810] bg-white outline-none focus:ring-2 focus:ring-[#f07070]/30 focus:border-[#f07070]"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#f07070] text-white font-medium text-sm hover:bg-[#d95050] transition-colors"
        >
          Buscar
        </button>
      </form>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Erro: {error.message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered && filtered.length > 0 ? (
          filtered.map((tutor) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pets = (tutor as any).pets ?? [];
            const hasBlocked = pets.some(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (p: any) => p.assessments?.some((a: any) => a.status === "BLOCKED")
            );

            return (
              <div
                key={tutor.id}
                className={`rounded-2xl bg-white border-2 shadow-sm p-5
                  ${hasBlocked ? "border-red-200" : "border-gray-100"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#2c1810]">{tutor.name}</h3>
                    <a
                      href={`https://wa.me/55${tutor.phone?.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#40d9c8] hover:underline"
                    >
                      📱 {tutor.phone}
                    </a>
                    {tutor.email && (
                      <p className="text-xs text-[#8a6050] mt-0.5">{tutor.email}</p>
                    )}
                  </div>
                  {hasBlocked && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700 flex-shrink-0">
                      🚫 Bloqueado
                    </span>
                  )}
                </div>

                {/* Pets */}
                {pets.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-semibold text-[#5c3d30] mb-2">
                      Pets ({pets.length}):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {pets.map((pet: any) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const blocked = pet.assessments?.some((a: any) => a.status === "BLOCKED");
                        return (
                          <span
                            key={pet.id}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium
                              ${blocked ? "bg-red-100 text-red-700" : "bg-[#fff5f4] text-[#f07070]"}`}
                          >
                            {pet.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {tutor.emergency_contact && (
                  <p className="text-xs text-[#8a6050] mt-2">
                    🆘 Emergência: {tutor.emergency_contact}
                  </p>
                )}

                <p className="text-xs text-[#c09080] mt-2">
                  Cadastrado em{" "}
                  {new Date(tutor.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            );
          })
        ) : (
          <div className="sm:col-span-2 rounded-2xl bg-white border border-gray-100 px-5 py-12 text-center">
            <p className="text-[#8a6050] text-sm">Nenhum tutor encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
