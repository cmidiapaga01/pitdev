"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step2Schema, type Step2Values } from "@/lib/schemas";
import {
  FormCard,
  Field,
  Input,
  Select,
  ToggleField,
} from "@/components/pre-checkin/FormCard";

interface Props {
  defaultValues?: Partial<Step2Values>;
  onNext: (data: Step2Values) => void;
  onBack: () => void;
}

export function Step2PetInfo({ defaultValues, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      petName: "",
      breed: "",
      birthDate: "",
      weight: "",
      gender: "male",
      castrated: false,
      temperament: "",
      energyLevel: "medium",
      getsAlongDogs: true,
      getsAlongHumans: true,
      separationAnxiety: false,
      destructiveBehavior: false,
      foodAggression: false,
      hasBitten: false,
      ...defaultValues,
    },
  });

  return (
    <form id="precheckin-form" onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Basic info */}
      <FormCard title="Informações do Pet" subtitle="Dados básicos do seu cão" icon="🐶">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome do Pet" error={errors.petName?.message} required>
            <Input
              {...register("petName")}
              placeholder="Ex: Thor"
              error={!!errors.petName}
            />
          </Field>

          <Field label="Raça" error={errors.breed?.message} required>
            <Input
              {...register("breed")}
              placeholder="Ex: Golden Retriever"
              error={!!errors.breed}
            />
          </Field>

          <Field label="Data de Nascimento" error={errors.birthDate?.message} required>
            <Input
              {...register("birthDate")}
              type="date"
              error={!!errors.birthDate}
            />
          </Field>

          <Field
            label="Peso (kg)"
            error={errors.weight?.message}
            required
          >
            <Input
              {...register("weight")}
              type="number"
              step="0.1"
              min="0.5"
              placeholder="Ex: 12.5"
              error={!!errors.weight}
            />
          </Field>

          <Field label="Sexo" error={errors.gender?.message} required>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select {...field} error={!!errors.gender}>
                  <option value="male">Macho</option>
                  <option value="female">Fêmea</option>
                </Select>
              )}
            />
          </Field>

          <Field
            label="Nível de Energia"
            error={errors.energyLevel?.message}
            required
          >
            <Controller
              name="energyLevel"
              control={control}
              render={({ field }) => (
                <Select {...field} error={!!errors.energyLevel}>
                  <option value="low">Baixo — Tranquilo e calmo</option>
                  <option value="medium">Médio — Equilibrado</option>
                  <option value="high">Alto — Agitado e energético</option>
                </Select>
              )}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Temperamento" error={errors.temperament?.message} required hint="Descreva brevemente o comportamento geral do pet">
              <Input
                {...register("temperament")}
                placeholder="Ex: Carinhoso, brincalhão, um pouco tímido com estranhos"
                error={!!errors.temperament}
              />
            </Field>
          </div>
        </div>
      </FormCard>

      {/* Quick toggles */}
      <FormCard title="Perfil Comportamental" subtitle="Responda com sinceridade para garantir a segurança de todos" icon="🧠">
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="castrated"
            control={control}
            render={({ field }) => (
              <ToggleField
                label="É castrado(a)?"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="getsAlongDogs"
            control={control}
            render={({ field }) => (
              <ToggleField
                label="Se dá bem com outros cães?"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="getsAlongHumans"
            control={control}
            render={({ field }) => (
              <ToggleField
                label="Se dá bem com pessoas?"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="separationAnxiety"
            control={control}
            render={({ field }) => (
              <ToggleField
                label="Tem ansiedade de separação?"
                checked={field.value}
                onChange={field.onChange}
                variant="warning"
              />
            )}
          />
          <Controller
            name="destructiveBehavior"
            control={control}
            render={({ field }) => (
              <ToggleField
                label="Comportamento destrutivo?"
                description="Destrói objetos quando estressado"
                checked={field.value}
                onChange={field.onChange}
                variant="warning"
              />
            )}
          />
          <Controller
            name="foodAggression"
            control={control}
            render={({ field }) => (
              <ToggleField
                label="Agressividade alimentar?"
                description="Protege a comida de outros"
                checked={field.value}
                onChange={field.onChange}
                variant="warning"
              />
            )}
          />
          <Controller
            name="hasBitten"
            control={control}
            render={({ field }) => (
              <ToggleField
                label="Já mordeu alguém?"
                description="Histórico de mordidas"
                checked={field.value}
                onChange={field.onChange}
                variant="warning"
              />
            )}
          />
        </div>
      </FormCard>

    </form>
  );
}
