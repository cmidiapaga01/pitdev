"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1Schema, type Step1Values } from "@/lib/schemas";
import { FormCard, Field, Input } from "@/components/pre-checkin/FormCard";

interface Props {
  defaultValues?: Partial<Step1Values>;
  onNext: (data: Step1Values) => void;
}

export function Step1TutorInfo({ defaultValues, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      tutorName: "",
      tutorPhone: "",
      tutorEmail: "",
      emergencyContact: "",
      ...defaultValues,
    },
  });

  return (
    <form id="precheckin-form" onSubmit={handleSubmit(onNext)} className="space-y-6">
      <FormCard
        title="Informações do Tutor"
        subtitle="Quem é o responsável pelo pet?"
        icon="👤"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Nome Completo" error={errors.tutorName?.message} required>
              <Input
                {...register("tutorName")}
                placeholder="Ex: Maria Silva"
                error={!!errors.tutorName}
              />
            </Field>
          </div>

          <Field label="Telefone / WhatsApp" error={errors.tutorPhone?.message} required>
            <Input
              {...register("tutorPhone")}
              type="tel"
              placeholder="(11) 99999-9999"
              error={!!errors.tutorPhone}
            />
          </Field>

          <Field
            label="E-mail"
            error={errors.tutorEmail?.message}
            hint="Opcional — para relatórios e confirmações"
          >
            <Input
              {...register("tutorEmail")}
              type="email"
              placeholder="maria@email.com"
              error={!!errors.tutorEmail}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="Contato de Emergência"
              error={errors.emergencyContact?.message}
              required
              hint="Telefone de alguém a ser contatado em casos de emergência"
            >
              <Input
                {...register("emergencyContact")}
                type="tel"
                placeholder="(11) 98888-8888"
                error={!!errors.emergencyContact}
              />
            </Field>
          </div>
        </div>
      </FormCard>

    </form>
  );
}
