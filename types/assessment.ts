// =====================================================
// PITPET PRE-CHECK-IN — FULL TYPE DEFINITIONS
// =====================================================

// ---- Enums & literals ----

export type VaccineType = "rabies" | "v8v10" | "kennel_cough";
export type VaccineStatus = "valid" | "expiring_soon" | "expired" | "missing";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type AssessmentStatus = "APPROVED" | "APPROVED_WITH_WARNINGS" | "BLOCKED";
export type Gender = "male" | "female";
export type EnergyLevel = "low" | "medium" | "high";
export type ServiceType =
  | "pre_checkout_bath"
  | "paw_hygiene"
  | "coat_brushing"
  | "wellness_check"
  | "wellbeing_report"
  | "flea_tick_treatment"
  | "nail_trimming"
  | "ear_cleaning"
  | "dental_brushing"
  | "calming_spa"
  | "hydration_treatment"
  | "photo_updates";

// ---- Database row types ----

export interface Tutor {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  emergency_contact: string | null;
  created_at: string;
}

export interface Pet {
  id: string;
  tutor_id: string;
  name: string;
  breed: string | null;
  birth_date: string | null;
  weight: number | null;
  gender: Gender | null;
  castrated: boolean;
  temperament: string | null;
  energy_level: EnergyLevel | null;
  gets_along_dogs: boolean;
  gets_along_humans: boolean;
  separation_anxiety: boolean;
  destructive_behavior: boolean;
  food_aggression: boolean;
  has_bitten: boolean;
  created_at: string;
}

export interface Vaccine {
  id: string;
  pet_id: string;
  type: VaccineType;
  applied_at: string | null;
  expires_at: string | null;
  proof_url: string | null;
  status: VaccineStatus;
}

export interface ParasiteControl {
  id: string;
  pet_id: string;
  last_deworming: string | null;
  flea_tick_active: boolean;
  last_antiparasitic: string | null;
  long_nails: boolean;
  ear_issues: boolean;
  skin_issues: boolean;
}

export interface Assessment {
  id: string;
  pet_id: string;
  approved: boolean;
  status: AssessmentStatus;
  risk_level: RiskLevel;
  sanitary_notes: string[];
  operational_notes: string[];
  sanitary_score: number;
  created_at: string;
}

export interface RequiredService {
  id: string;
  assessment_id: string;
  service_type: ServiceType;
  mandatory: boolean;
  reason: string | null;
  price: number | null;
}

export interface UploadedDocument {
  id: string;
  pet_id: string;
  type: string;
  file_url: string;
}

// ---- Form step data types ----

export interface Step1Data {
  tutorName: string;
  tutorPhone: string;
  tutorEmail: string;
  emergencyContact: string;
}

export interface Step2Data {
  petName: string;
  breed: string;
  birthDate: string;
  weight: string;
  gender: Gender;
  castrated: boolean;
  temperament: string;
  energyLevel: EnergyLevel;
  getsAlongDogs: boolean;
  getsAlongHumans: boolean;
  separationAnxiety: boolean;
  destructiveBehavior: boolean;
  foodAggression: boolean;
  hasBitten: boolean;
}

export interface VaccineEntry {
  appliedAt: string;
  expiresAt: string;
  proof: File | null;
  proofUrl?: string;
  status?: VaccineStatus;
}

export interface Step3Data {
  rabies: VaccineEntry;
  v8v10: VaccineEntry;
  kennelCough: VaccineEntry;
}

export interface Step4Data {
  lastDeworming: string;
  fleaTickActive: boolean;
  lastAntiparasitic: string;
  longNails: boolean;
  earIssues: boolean;
  skinIssues: boolean;
}

export interface Step5Data {
  preCheckoutBath: boolean;
  pawHygiene: boolean;
  coatBrushing: boolean;
  wellnessCheck: boolean;
  wellbeingReport: boolean;
}

export interface Step6Data {
  earCleaning: boolean;
  dentalBrushing: boolean;
  calmingSpa: boolean;
  hydrationTreatment: boolean;
  photoUpdates: boolean;
}

export interface Step7Data {
  sanitaryAgreement: boolean;
  collectiveEnvironmentAck: boolean;
  emergencyVetAuth: boolean;
  mandatoryProceduresAuth: boolean;
  accuracyConfirmation: boolean;
}

export interface FullFormData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
  step6: Step6Data;
  step7: Step7Data;
}

// ---- Assessment engine result ----

export interface VaccineWarning {
  type: VaccineType;
  status: VaccineStatus;
  message: string;
  blocksApproval: boolean;
}

export interface AutoService {
  serviceType: ServiceType;
  mandatory: boolean;
  reason: string;
  price: number;
}

export interface AssessmentResult {
  status: AssessmentStatus;
  riskLevel: RiskLevel;
  sanitaryScore: number;
  vaccineWarnings: VaccineWarning[];
  autoServices: AutoService[];
  sanitaryNotes: string[];
  operationalNotes: string[];
}

// ---- Admin view types ----

export interface PetWithTutor extends Pet {
  tutor: Tutor;
  latest_assessment?: Assessment;
  vaccines?: Vaccine[];
}

export interface AlertSummary {
  petId: string;
  petName: string;
  tutorName: string;
  tutorPhone: string;
  alertType: "expired_vaccine" | "expiring_vaccine" | "blocked" | "behavior";
  message: string;
  createdAt: string;
}
