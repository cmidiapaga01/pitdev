import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pré-Check-In | PitPet Store",
  description:
    "Formulário de triagem sanitária e pré-check-in para hospedagem na PitPet Store.",
};

export default function PreCheckinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f4] via-white to-[#ffeaea]">
      {/* Top bar */}
      <div className="border-b border-[#ffd4d4] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <span className="font-bold text-[#f07070] text-lg tracking-tight">
              PitPet Store
            </span>
          </div>
          <span className="text-xs text-[#8a6050] bg-[#fff5f4] border border-[#ffd4d4] rounded-full px-3 py-1">
            Formulário Seguro
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}
