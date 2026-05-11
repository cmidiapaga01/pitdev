"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
  control: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
}

function VaccineBlock({ vaccineKey, label, icon, register, errors, watch }: VaccineBlockProps) {
  const expiresAtValue: string = watch(`${vaccineKey}.expiresAt`) ?? "";
  const status = getVaccineStatus(expiresAtValue);
  const fieldError = errors?.[vaccineKey];

  const [fileName, setFileName] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

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
        <AlertBox type="error" title="Vacina Vencida — Hospedagem Bloqueada">
          Esta vacina está vencida e coloca outros animais em risco. A reserva
          não pode ser aprovada até a renovação do cartão de vacinação.
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

      {/* File upload */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
          Comprovante de Vacinação
          <span className="text-[#8a6050] font-normal ml-1">(foto ou PDF)</span>
        </label>
        <div
          className="flex items-center gap-3 border border-dashed border-[#ffd4d4] rounded-xl px-4 py-3 cursor-pointer hover:border-[#f07070] hover:bg-[#fff5f4] transition-all"
          onClick={() => fileRef.current?.click()}
        >
          <span className="text-[#f07070] text-lg">📎</span>
          <span className="text-sm text-[#8a6050] flex-1 truncate">
            {fileName || "Clique para anexar arquivo"}
          </span>
          <span className="text-xs text-[#c09080]">JPG, PNG, PDF</span>
        </div>
        <input
          ref={fileRef}
          {...register(`${vaccineKey}.proof`)}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setFileName(file.name);
          }}
        />
      </div>
    </div>
  );
}

export function Step3Vaccines({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      rabies: { appliedAt: "", expiresAt: "", proof: null },
      v8v10: { appliedAt: "", expiresAt: "", proof: null },
      kennelCough: { appliedAt: "", expiresAt: "", proof: null },
      ...defaultValues,
    },
  });

  const [hasBlocked, setHasBlocked] = useState(false);

  // Watch for expired vaccines
  const rabiesExpires = watch("rabies.expiresAt");
  const v8v10Expires = watch("v8v10.expiresAt");
  const kennelCoughExpires = watch("kennelCough.expiresAt");

  useEffect(() => {
    const blocked = [rabiesExpires, v8v10Expires, kennelCoughExpires].some(
      (d) => d && getVaccineStatus(d) === "expired"
    );
    setHasBlocked(blocked);
  }, [rabiesExpires, v8v10Expires, kennelCoughExpires]);

  return (
    <form id="precheckin-form" onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">⚕️ Documentação Sanitária Obrigatória</p>
        <p>
          Todas as vacinas abaixo são obrigatórias para hospedagem. Vacinas
          vencidas ou ausentes bloqueiam automaticamente a reserva.
        </p>
      </div>

      {VACCINE_KEYS.map(({ key, label, icon }) => (
        <VaccineBlock
          key={key}
          vaccineKey={key}
          label={label}
          icon={icon}
          register={register}
          control={control}
          errors={errors}
          watch={watch}
        />
      ))}

      {hasBlocked && (
        <AlertBox type="error" title="Reserva Bloqueada">
          Uma ou mais vacinas obrigatórias estão vencidas. A aprovação da
          reserva está suspensa. Por favor, atualize o cartão de vacinação do
          seu pet antes de prosseguir.
        </AlertBox>
      )}

    </form>
  );
}
