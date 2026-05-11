"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step4Schema, type Step4Values } from "@/lib/schemas";
import {
  FormCard,
  Field,
  Input,
  ToggleField,
  AlertBox,
} from "@/components/pre-checkin/FormCard";
import { differenceInDays, parseISO, isValid } from "date-fns";

interface Props {
  defaultValues?: Partial<Step4Values>;
  onNext: (data: Step4Values) => void;
  onBack: () => void;
}

export function Step4Parasites({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Step4Values>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      lastDeworming: "",
      fleaTickActive: false,
      lastAntiparasitic: "",
      longNails: false,
      earIssues: false,
      skinIssues: false,
      ...defaultValues,
    },
  });

  const lastAntiparasitic = watch("lastAntiparasitic");
  const fleaTickActive = watch("fleaTickActive");
  const longNails = watch("longNails");

  const needsFleaTick = (() => {
    if (!fleaTickActive) return true;
    if (!lastAntiparasitic) return true;
    const date = parseISO(lastAntiparasitic);
    if (!isValid(date)) return true;
    return differenceInDays(new Date(), date) > 30;
  })();

  return (
    <form id="precheckin-form" onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Deworming */}
      <FormCard
        title="Controle de Parasitas"
        subtitle="Informações sobre proteção antiparasitária"
        icon="🛡️"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Última Vermifugação"
            error={errors.lastDeworming?.message}
            required
          >
            <Input
              {...register("lastDeworming")}
              type="date"
              error={!!errors.lastDeworming}
            />
          </Field>

          <Field
            label="Última Aplicação de Antiparasitário"
            error={errors.lastAntiparasitic?.message}
            required
            hint="Pulga, carrapato, antipulgas, etc."
          >
            <Input
              {...register("lastAntiparasitic")}
              type="date"
              error={!!errors.lastAntiparasitic}
            />
          </Field>

          <div className="sm:col-span-2">
            <Controller
              name="fleaTickActive"
              control={control}
              render={({ field }) => (
                <ToggleField
                  label="Proteção contra pulgas e carrapatos está ativa?"
                  description="Pipeta, coleira ou comprimido em efeito"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {needsFleaTick && (
          <div className="mt-4">
            <AlertBox type="warning" title="Tratamento Obrigatório Adicionado">
              A proteção antiparasitária está desatualizada ou inativa. O
              tratamento contra pulgas e carrapatos será incluído
              obrigatoriamente na chegada para proteger o ambiente coletivo.
            </AlertBox>
          </div>
        )}
      </FormCard>

      {/* Hygiene assessment */}
      <FormCard
        title="Avaliação de Higiene"
        subtitle="Condições físicas na chegada"
        icon="✨"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Controller
            name="longNails"
            control={control}
            render={({ field }) => (
              <ToggleField
                label="Unhas longas?"
                description="Risco para outros animais"
                checked={field.value}
                onChange={field.onChange}
                variant="warning"
              />
            )}
          />
          <Controller
            name="earIssues"
            control={control}
            render={({ field }) => (
              <ToggleField
                label="Problemas nos ouvidos?"
                description="Coceira, odor, secreção"
                checked={field.value}
                onChange={field.onChange}
                variant="warning"
              />
            )}
          />
          <Controller
            name="skinIssues"
            control={control}
            render={({ field }) => (
              <ToggleField
                label="Problemas de pele?"
                description="Lesões, alergias, fungos"
                checked={field.value}
                onChange={field.onChange}
                variant="warning"
              />
            )}
          />
        </div>

        {longNails && (
          <div className="mt-4">
            <AlertBox type="info" title="Corte de Unhas Adicionado">
              Unhas longas detectadas. O corte de unhas será incluído
              obrigatoriamente para a segurança de todos os animais e da equipe.
            </AlertBox>
          </div>
        )}
      </FormCard>

    </form>
  );
}
