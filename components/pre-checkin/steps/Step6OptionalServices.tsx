"use client";

import { useState } from "react";
import { type Step6Values } from "@/lib/schemas";
import { FormCard, ServiceCard } from "@/components/pre-checkin/FormCard";

interface Props {
  defaultValues?: Partial<Step6Values>;
  onNext: (data: Step6Values) => void;
  onBack: () => void;
}

const OPTIONAL_SERVICES: Array<{
  key: keyof Step6Values;
  title: string;
  description: string;
  icon: string;
  price: number;
}> = [
  {
    key: "earCleaning",
    title: "Limpeza de Ouvidos",
    description: "Higiene auricular com produtos veterinários específicos.",
    icon: "👂",
    price: 30,
  },
  {
    key: "dentalBrushing",
    title: "Escovação Dental",
    description: "Higiene bucal com escova e pasta para cães.",
    icon: "🦷",
    price: 35,
  },
  {
    key: "calmingSpa",
    title: "Spa Relaxante",
    description: "Sessão de massagem e aromaterapia para redução de estresse.",
    icon: "🧘",
    price: 60,
  },
  {
    key: "hydrationTreatment",
    title: "Hidratação Capilar",
    description: "Tratamento hidratante para pelagem seca ou sensível.",
    icon: "💧",
    price: 40,
  },
  {
    key: "photoUpdates",
    title: "Atualizações por Foto",
    description: "Receba fotos do seu pet durante a estadia no WhatsApp.",
    icon: "📸",
    price: 20,
  },
];

export function Step6OptionalServices({ defaultValues, onNext, onBack }: Props) {
  const [services, setServices] = useState<Step6Values>({
    earCleaning: false,
    dentalBrushing: false,
    calmingSpa: false,
    hydrationTreatment: false,
    photoUpdates: false,
    ...defaultValues,
  });

  const selectedCount = Object.values(services).filter(Boolean).length;
  const total = OPTIONAL_SERVICES.filter(
    (s) => services[s.key]
  ).reduce((acc, s) => acc + s.price, 0);

  return (
    <form id="precheckin-form" onSubmit={(e) => { e.preventDefault(); onNext(services); }} className="space-y-6">
      <FormCard
        title="Serviços Premium Opcionais"
        subtitle="Eleve ainda mais a experiência do seu pet"
        icon="💎"
      >
        <div className="space-y-3">
          {OPTIONAL_SERVICES.map((svc) => (
            <ServiceCard
              key={svc.key}
              title={svc.title}
              description={svc.description}
              icon={svc.icon}
              price={svc.price}
              checked={services[svc.key]}
              onChange={(checked) =>
                setServices((prev) => ({ ...prev, [svc.key]: checked }))
              }
            />
          ))}
        </div>

        {/* Summary */}
        {selectedCount > 0 && (
          <div className="mt-5 rounded-xl bg-[#fff5f4] border border-[#ffd4d4] px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#2c1810]">
                {selectedCount} serviço{selectedCount > 1 ? "s" : ""} adicional{selectedCount > 1 ? "is" : ""} selecionado{selectedCount > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-[#8a6050] mt-0.5">
                Serão agendados durante a estadia
              </p>
            </div>
            <span className="text-lg font-bold text-[#f07070]">
              + R$ {total.toFixed(2)}
            </span>
          </div>
        )}
      </FormCard>

    </form>
  );
}
