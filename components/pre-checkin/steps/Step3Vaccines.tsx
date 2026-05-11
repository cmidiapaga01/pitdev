"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInDays, parseISO, isValid } from "date-fns";
import { step3Schema, type Step3Values } from "@/lib/schemas";
import { VACCINE_LABELS } from "@/lib/assessment-engine";
import type { VaccineType, VaccineStatus } from "@/types/assessment";
import {
  FormCard,
  Field,
  Input,
  AlertBox,
} from "@/components/pre-checkin/FormCard";

interface Props {
  defaultValues?: Partial<Step3Values>;
  onNext: (data: Step3Values) => void;
  onBack: () => void;
}

type VaccineKey = "rabies" | "v8v10" | "kennelCough";

const VACCINE_KEYS: Array<{ key: VaccineKey; type: VaccineType; label: string; icon: string }> = [
  { key: "rabies", type: "rabies", label: VACCINE_LABELS.rabies, icon: "💉" },
  { key: "v8v10", type: "v8v10", label: VACCINE_LABELS.v8v10, icon: "🔬" },
  { key: "kennelCough", type: "kennel_cough", label: VACCINE_LABELS.kennel_cough, icon: "🫁" },
];

function getVaccineStatus(expiresAt: string): VaccineStatus {
  if (!expiresAt) return "missing";
  const date = parseISO(expiresAt);
  if (!isValid(date)) return "missing";
  const days = differenceInDays(date, new Date());
  if (days < 0) return "expired";
  if (days <= 30) return "expiring_soon";
  return "valid";
}

interface VaccineBlockProps {
  vaccineKey: VaccineKey;
  label: string;
  icon: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
}

function VaccineBlock({ vaccineKey, label, icon, register, errors, watch }: VaccineBlockProps) {
  const expiresAtValue: string = watch(`${vaccineKey}.expiresAt`) ?? "";
  const status = getVaccineStatus(expiresAtValue);
  const fieldError = errors?.[vaccineKey];

  const statusStyles: Record<VaccineStatus, string> = {
    valid: "bg-emerald-50 border-emerald-200",
    expiring_soon: "bg-amber-50 border-amber-200",
    expired: "bg-red-50 border-red-200",
    missing: "bg-white border-[#ffd4d4]",
  };

  return (
    <div className={`rounded-2xl border-2 p-5 transition-colors ${statusStyles[status]}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h4 className="font-semibold text-[#2c1810] text-sm">{label}</h4>
        {status === "expired" && (
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
            VENCIDA
          </span>
        )}
        {status === "expiring_soon" && (
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-white">
            VENCE EM BREVE
          </span>
        )}
        {status === "valid" && (
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
            ✓ VÁLIDA
          </span>
        )}
      </div>

      {status === "expired" && (
        <AlertBox type="warning" title="Vacina Vencida — Serviço adicionado automaticamente">
          Esta vacina está vencida. A equipe realizará verificação sanitária na entrada, que será adicionada como serviço obrigatório.
        </AlertBox>
      )}

      <div className="grid gap-3 sm:grid-cols-2 mt-3">
        <Field
          label="Data de Aplicação"
          error={fieldError?.appliedAt?.message}
          required
        >
          <Input
            {...register(`${vaccineKey}.appliedAt`)}
            type="date"
            error={!!fieldError?.appliedAt}
          />
        </Field>
        <Field
          label="Data de Validade"
          error={fieldError?.expiresAt?.message}
          required
        >
          <Input
            {...register(`${vaccineKey}.expiresAt`)}
            type="date"
            error={!!fieldError?.expiresAt}
          />
        </Field>
      </div>

    </div>
  );
}

export function Step3Vaccines({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      rabies: { appliedAt: "", expiresAt: "" },
      v8v10: { appliedAt: "", expiresAt: "" },
      kennelCough: { appliedAt: "", expiresAt: "" },
      ...defaultValues,
    },
  });

  return (
    <form id="precheckin-form" onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">⚕️ Documentação Sanitária</p>
        <p>
          Informe as datas das vacinas do seu pet. Vacinas vencidas ou ausentes geram serviços adicionais obrigatórios na entrada.
        </p>
      </div>

      {VACCINE_KEYS.map(({ key, label, icon }) => (
        <VaccineBlock
          key={key}
          vaccineKey={key}
          label={label}
          icon={icon}
          register={register}
          errors={errors}
          watch={watch}
        />
      ))}

    </form>
  );
}
