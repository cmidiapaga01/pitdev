import { z } from "zod";

// ---- Step 1: Tutor Info ----
export const step1Schema = z.object({
  tutorName: z.string().min(3, "Nome completo obrigatório"),
  tutorPhone: z
    .string()
    .min(10, "Telefone inválido")
    .regex(/^[\d\s\(\)\-\+]+$/, "Formato de telefone inválido"),
  tutorEmail: z.string().email("E-mail inválido").or(z.literal("")),
  emergencyContact: z.string().min(10, "Contato de emergência obrigatório"),
});

// ---- Step 2: Pet Info ----
export const step2Schema = z.object({
  petName: z.string().min(1, "Nome do pet obrigatório"),
  breed: z.string().min(1, "Raça obrigatória"),
  birthDate: z.string().min(1, "Data de nascimento obrigatória"),
  weight: z
    .string()
    .min(1, "Peso obrigatório")
    .refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Peso inválido"),
  gender: z.enum(["male", "female"]),
  castrated: z.boolean(),
  temperament: z.string().min(1, "Temperamento obrigatório"),
  energyLevel: z.enum(["low", "medium", "high"]),
  getsAlongDogs: z.boolean(),
  getsAlongHumans: z.boolean(),
  separationAnxiety: z.boolean(),
  destructiveBehavior: z.boolean(),
  foodAggression: z.boolean(),
  hasBitten: z.boolean(),
});

// ---- Step 3: Vaccines ----
const vaccineEntrySchema = z.object({
  appliedAt: z.string().min(1, "Data de aplicação obrigatória"),
  expiresAt: z.string().min(1, "Data de validade obrigatória"),
  status: z.enum(["valid", "expiring_soon", "expired", "missing"]).optional(),
});

export const step3Schema = z.object({
  rabies: vaccineEntrySchema,
  v8v10: vaccineEntrySchema,
  kennelCough: vaccineEntrySchema,
});

// ---- Step 4: Parasites ----
export const step4Schema = z.object({
  lastDeworming: z.string().min(1, "Data de vermifugação obrigatória"),
  fleaTickActive: z.boolean(),
  lastAntiparasitic: z.string().min(1, "Data do antiparasitário obrigatória"),
  longNails: z.boolean(),
  earIssues: z.boolean(),
  skinIssues: z.boolean(),
});

// ---- Step 5: Included Premium Care ----
export const step5Schema = z.object({
  preCheckoutBath: z.boolean(),
  pawHygiene: z.boolean(),
  coatBrushing: z.boolean(),
  wellnessCheck: z.boolean(),
  wellbeingReport: z.boolean(),
});

// ---- Step 6: Optional Services ----
export const step6Schema = z.object({
  earCleaning: z.boolean(),
  dentalBrushing: z.boolean(),
  calmingSpa: z.boolean(),
  hydrationTreatment: z.boolean(),
  photoUpdates: z.boolean(),
});

// ---- Step 7: Terms ----
export const step7Schema = z.object({
  sanitaryAgreement: z
    .boolean()
    .refine((v) => v === true, { message: "Você deve aceitar o acordo sanitário" }),
  collectiveEnvironmentAck: z
    .boolean()
    .refine((v) => v === true, { message: "Você deve confirmar o ambiente coletivo" }),
  emergencyVetAuth: z
    .boolean()
    .refine((v) => v === true, { message: "Você deve autorizar atendimento veterinário de emergência" }),
  mandatoryProceduresAuth: z
    .boolean()
    .refine((v) => v === true, { message: "Você deve autorizar procedimentos obrigatórios" }),
  accuracyConfirmation: z
    .boolean()
    .refine((v) => v === true, { message: "Você deve confirmar a veracidade das informações" }),
});

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type Step4Values = z.infer<typeof step4Schema>;
export type Step5Values = z.infer<typeof step5Schema>;
export type Step6Values = z.infer<typeof step6Schema>;
export type Step7Values = z.infer<typeof step7Schema>;
