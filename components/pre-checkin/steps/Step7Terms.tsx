"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step7Schema, type Step7Values } from "@/lib/schemas";
import { FormCard } from "@/components/pre-checkin/FormCard";

interface Props {
  defaultValues?: Partial<Step7Values>;
  onNext: (data: Step7Values) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

interface TermCheckboxProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  icon: string;
}

function TermCheckbox({
  label,
  description,
  checked,
  onChange,
  error,
  icon,
}: TermCheckboxProps) {
  return (
    <label
      className={`block rounded-2xl border-2 p-4 cursor-pointer transition-all
        ${checked ? "border-[#40d9c8] bg-emerald-50" : "border-[#ffd4d4] bg-white hover:border-[#f07070]/50"}
        ${error ? "border-red-400" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
            ${checked ? "border-[#40d9c8] bg-[#40d9c8]" : "border-[#ffd4d4] bg-white"}`}
          onClick={() => onChange(!checked)}
        >
          {checked && (
            <svg viewBox="0 0 10 8" className="w-3 h-3 fill-none stroke-white stroke-2">
              <path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <span className="text-lg mr-2">{icon}</span>
          <span className="text-sm font-semibold text-[#2c1810]">{label}</span>
          <p className="text-xs text-[#8a6050] mt-1 leading-relaxed">{description}</p>
          {error && (
            <p className="text-xs text-red-500 mt-1">⚠ {error}</p>
          )}
        </div>
      </div>
    </label>
  );
}

export function Step7Terms({ defaultValues, onNext, onBack, isSubmitting }: Props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Step7Values>({
    resolver: zodResolver(step7Schema),
    defaultValues: {
      sanitaryAgreement: false,
      collectiveEnvironmentAck: false,
      emergencyVetAuth: false,
      mandatoryProceduresAuth: false,
      accuracyConfirmation: false,
      ...defaultValues,
    },
  });

  const terms: Array<{
    name: keyof Step7Values;
    label: string;
    description: string;
    icon: string;
  }> = [
    {
      name: "sanitaryAgreement",
      icon: "🧪",
      label: "Acordo de Responsabilidade Sanitária",
      description:
        "Confirmo que meu pet está em condições sanitárias adequadas para conviver em ambiente coletivo, e que todas as informações de saúde fornecidas são verdadeiras.",
    },
    {
      name: "collectiveEnvironmentAck",
      icon: "🏡",
      label: "Ciência do Ambiente Coletivo",
      description:
        "Estou ciente de que meu pet estará em contato com outros animais e que, apesar de todos os cuidados, existe risco inerente a ambientes coletivos.",
    },
    {
      name: "emergencyVetAuth",
      icon: "🏥",
      label: "Autorização de Atendimento Veterinário de Emergência",
      description:
        "Autorizo a PitPet Store a buscar atendimento veterinário de emergência para meu pet se necessário, comprometendo-me a arcar com as despesas.",
    },
    {
      name: "mandatoryProceduresAuth",
      icon: "✂️",
      label: "Autorização de Procedimentos Obrigatórios",
      description:
        "Autorizo a realização dos procedimentos obrigatórios indicados pelo sistema de triagem sanitária (ex: tratamento antiparasitário, corte de unhas), necessários para a proteção coletiva.",
    },
    {
      name: "accuracyConfirmation",
      icon: "✅",
      label: "Confirmação de Veracidade das Informações",
      description:
        "Confirmo que todas as informações fornecidas neste formulário são precisas e verdadeiras. Declaro estar ciente de que informações falsas podem resultar no bloqueio da reserva.",
    },
  ];

  return (
    <form id="precheckin-form" onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-[#40d9c8]/10 to-[#fff5f4] border border-[#40d9c8]/30 px-5 py-4">
        <p className="text-sm text-[#2c1810] font-medium">
          📜 Leia com atenção e confirme todos os termos abaixo para finalizar
          seu pré-check-in.
        </p>
      </div>

      <FormCard title="Termos e Autorizações" subtitle="Confirmação obrigatória para prosseguir" icon="📋">
        <div className="space-y-3">
          {terms.map((term) => (
            <Controller
              key={term.name}
              name={term.name}
              control={control}
              render={({ field }) => (
                <TermCheckbox
                  label={term.label}
                  description={term.description}
                  icon={term.icon}
                  checked={!!field.value}
                  onChange={field.onChange}
                  error={errors[term.name]?.message}
                />
              )}
            />
          ))}
        </div>
      </FormCard>

    </form>
  );
}
