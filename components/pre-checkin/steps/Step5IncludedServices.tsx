"use client";

import { useState } from "react";
import { type Step5Values } from "@/lib/schemas";
import { INCLUDED_SERVICES_TOTAL } from "@/lib/assessment-engine";
import { FormCard, ServiceCard } from "@/components/pre-checkin/FormCard";

interface Props {
  defaultValues?: Partial<Step5Values>;
  onNext: (data: Step5Values) => void;
  onBack: () => void;
}

const INCLUDED_SERVICES: Array<{
  key: keyof Step5Values;
  title: string;
  description: string;
  icon: string;
  price: number;
}> = [
  {
    key: "preCheckoutBath",
    title: "Banho de Check-out",
    description: "Banho completo com secagem profissional antes da volta para casa.",
    icon: "🛁",
    price: 80,
  },
  {
    key: "pawHygiene",
    title: "Higiene das Patinhas",
    description: "Limpeza e hidratação das almofadas e espaços interdigitais.",
    icon: "🐾",
    price: 20,
  },
  {
    key: "coatBrushing",
    title: "Escovação da Pelagem",
    description: "Escovação completa para remover pelos soltos e nós.",
    icon: "✨",
    price: 30,
  },
  {
    key: "wellnessCheck",
    title: "Check de Bem-Estar",
    description: "Avaliação rápida do estado físico e emocional durante a estadia.",
    icon: "❤️",
    price: 50,
  },
  {
    key: "wellbeingReport",
    title: "Relatório Final de Bem-Estar",
    description: "Relatório detalhado com fotos e observações sobre a estadia.",
    icon: "📋",
    price: 40,
  },
];

export function Step5IncludedServices({ defaultValues, onNext, onBack }: Props) {
  const [services, setServices] = useState<Step5Values>({
    preCheckoutBath: true,
    pawHygiene: true,
    coatBrushing: true,
    wellnessCheck: true,
    wellbeingReport: true,
    ...defaultValues,
  });

  const [showNote, setShowNote] = useState<string | null>(null);

  function handleToggle(key: keyof Step5Values, checked: boolean) {
    setServices((prev) => ({ ...prev, [key]: checked }));
    if (!checked) {
      setShowNote(key);
      setTimeout(() => setShowNote(null), 3500);
    }
  }

  return (
    <form id="precheckin-form" onSubmit={(e) => { e.preventDefault(); onNext(services); }} className="space-y-6">
      {/* Hero banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#f07070] to-[#ff9b9b] text-white p-6 shadow-md">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">⭐</span>
          <div>
            <h3 className="font-bold text-lg">Cuidados Premium Incluídos</h3>
            <p className="text-white/80 text-sm">Fazem parte da nossa experiência de hospedagem</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2 w-fit">
          <span className="text-sm font-semibold">Valor incluso:</span>
          <span className="font-bold text-lg">
            R$ {INCLUDED_SERVICES_TOTAL.toFixed(2)}
          </span>
        </div>
      </div>

      <FormCard
        title="Serviços de Cuidado Incluídos"
        subtitle="Todos os serviços abaixo estão incluídos no seu pacote de hospedagem"
        icon="🎁"
      >
        <div className="space-y-3">
          {INCLUDED_SERVICES.map((svc) => (
            <ServiceCard
              key={svc.key}
              title={svc.title}
              description={svc.description}
              icon={svc.icon}
              price={svc.price}
              checked={services[svc.key]}
              onChange={(v) => handleToggle(svc.key, v)}
              included
            />
          ))}
        </div>

        {showNote && (
          <div className="mt-4 rounded-xl bg-[#fff5f4] border border-[#ffd4d4] px-4 py-3 text-sm text-[#8a6050]">
            <p className="font-medium text-[#f07070] mb-0.5">Serviço incluído no pacote</p>
            <p>
              Este serviço faz parte da nossa experiência premium de hospedagem.
              O valor total do pacote permanece o mesmo.
            </p>
          </div>
        )}
      </FormCard>

    </form>
  );
}
