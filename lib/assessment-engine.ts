// =====================================================
// PITPET — ASSESSMENT ENGINE
// Core business logic: risk scoring, vaccine validation,
// auto-service selection, status determination
// =====================================================

import { differenceInDays, parseISO, isValid } from "date-fns";
import type {
  VaccineType,
  VaccineStatus,
  VaccineWarning,
  AutoService,
  AssessmentResult,
  AssessmentStatus,
  RiskLevel,
} from "@/types/assessment";
import type { Step2Values, Step3Values, Step4Values } from "@/lib/schemas";

// ---- Vaccine expiration thresholds (days) ----
const EXPIRING_SOON_THRESHOLD = 30; // < 30 days = "expiring soon"

// ---- Service prices (BRL) ----
const SERVICE_PRICES: Record<string, number> = {
  flea_tick_treatment: 45,
  nail_trimming: 25,
  ear_cleaning: 30,
  dental_brushing: 35,
  calming_spa: 60,
  hydration_treatment: 40,
  photo_updates: 20,
  sanitary_check: 60,
  behavior_monitoring: 50,
};

// ---- Included (premium bundled) service prices ----
export const INCLUDED_SERVICE_PRICES: Record<string, number> = {
  pre_checkout_bath: 80,
  paw_hygiene: 20,
  coat_brushing: 30,
  wellness_check: 50,
  wellbeing_report: 40,
};

export const INCLUDED_SERVICES_TOTAL = Object.values(
  INCLUDED_SERVICE_PRICES
).reduce((a, b) => a + b, 0);

// ---- Vaccine human labels ----
export const VACCINE_LABELS: Record<VaccineType, string> = {
  rabies: "Raiva",
  v8v10: "V8/V10",
  kennel_cough: "Tosse dos Canis / Gripe Canina",
};

// ---- Evaluate a single vaccine ----
function evaluateVaccine(
  type: VaccineType,
  expiresAt: string | null | undefined
): { status: VaccineStatus; warning: VaccineWarning | null } {
  if (!expiresAt) {
    return {
      status: "missing",
      warning: {
        type,
        status: "missing",
        message: `Vacina ${VACCINE_LABELS[type]} não informada. Será realizada triagem sanitária obrigatória na entrada.`,
        blocksApproval: false,
      },
    };
  }

  const expiryDate = parseISO(expiresAt);
  if (!isValid(expiryDate)) {
    return {
      status: "missing",
      warning: {
        type,
        status: "missing",
        message: `Data de validade da vacina ${VACCINE_LABELS[type]} é inválida. Triagem sanitária obrigatória na entrada.`,
        blocksApproval: false,
      },
    };
  }

  const today = new Date();
  const daysUntilExpiry = differenceInDays(expiryDate, today);

  if (daysUntilExpiry < 0) {
    return {
      status: "expired",
      warning: {
        type,
        status: "expired",
        message: `A vacina ${VACCINE_LABELS[type]} está VENCIDA. Triagem sanitária obrigatória será realizada na entrada (serviço adicionado automaticamente).`,
        blocksApproval: false,
      },
    };
  }

  if (daysUntilExpiry <= EXPIRING_SOON_THRESHOLD) {
    return {
      status: "expiring_soon",
      warning: {
        type,
        status: "expiring_soon",
        message: `A vacina ${VACCINE_LABELS[type]} vence em ${daysUntilExpiry} dias. Recomendamos atualização antes da hospedagem.`,
        blocksApproval: false,
      },
    };
  }

  return { status: "valid", warning: null };
}

// ---- Evaluate all vaccines ----
function evaluateVaccines(step3: Step3Values): {
  warnings: VaccineWarning[];
  autoServices: AutoService[];
} {
  const entries: Array<{ type: VaccineType; expiresAt: string }> = [
    { type: "rabies", expiresAt: step3.rabies?.expiresAt ?? "" },
    { type: "v8v10", expiresAt: step3.v8v10?.expiresAt ?? "" },
    { type: "kennel_cough", expiresAt: step3.kennelCough?.expiresAt ?? "" },
  ];

  const warnings: VaccineWarning[] = [];
  const autoServices: AutoService[] = [];
  let needsSanitaryCheck = false;

  for (const entry of entries) {
    const { warning } = evaluateVaccine(entry.type, entry.expiresAt);
    if (warning) {
      warnings.push(warning);
      if (warning.status === "expired" || warning.status === "missing") {
        needsSanitaryCheck = true;
      }
    }
  }

  if (needsSanitaryCheck) {
    autoServices.push({
      serviceType: "sanitary_check",
      mandatory: true,
      reason: "Triagem sanitária obrigatória na entrada por vacinas vencidas ou ausentes.",
      price: SERVICE_PRICES.sanitary_check,
    });
  }

  return { warnings, autoServices };
}

// ---- Evaluate behavior risk ----
function evaluateBehavior(step2: Step2Values): {
  autoServices: AutoService[];
  notes: string[];
  riskPoints: number;
} {
  const notes: string[] = [];
  const autoServices: AutoService[] = [];
  let riskPoints = 0;

  if (step2.hasBitten && (step2.foodAggression || step2.destructiveBehavior)) {
    autoServices.push({
      serviceType: "behavior_monitoring",
      mandatory: true,
      reason: "Histórico de mordidas com agressividade — monitoramento intensivo obrigatório.",
      price: SERVICE_PRICES.behavior_monitoring,
    });
    notes.push(
      "⚠️ Pet com histórico de mordidas e agressividade. Monitoramento intensivo adicionado automaticamente."
    );
    riskPoints += 30;
  } else if (step2.hasBitten) {
    notes.push(
      "⚠️ Pet tem histórico de mordidas. Será mantido em área separada e com monitoramento extra."
    );
    riskPoints += 20;
  }

  if (step2.foodAggression) {
    notes.push(
      "⚠️ Agressividade alimentar detectada. Alimentação individual obrigatória."
    );
    riskPoints += 15;
  }

  if (step2.separationAnxiety) {
    notes.push(
      "ℹ️ Ansiedade de separação. Equipe deve oferecer atenção adicional."
    );
    riskPoints += 5;
  }

  if (step2.destructiveBehavior) {
    notes.push(
      "⚠️ Comportamento destrutivo. Verificar ambiente e monitoramento."
    );
    riskPoints += 10;
  }

  if (!step2.getsAlongDogs) {
    notes.push(
      "ℹ️ Pet não se dá bem com outros cães. Área de socialização restrita."
    );
    riskPoints += 10;
  }

  return { autoServices, notes, riskPoints };
}

// ---- Evaluate parasite control ----
function evaluateParasites(step4: Step4Values): {
  autoServices: AutoService[];
  notes: string[];
  riskPoints: number;
} {
  const autoServices: AutoService[] = [];
  const notes: string[] = [];
  let riskPoints = 0;

  // Check antiparasitic freshness
  if (step4.lastAntiparasitic) {
    const lastDate = parseISO(step4.lastAntiparasitic);
    if (isValid(lastDate)) {
      const daysSince = differenceInDays(new Date(), lastDate);
      if (daysSince > 30 || !step4.fleaTickActive) {
        autoServices.push({
          serviceType: "flea_tick_treatment",
          mandatory: true,
          reason:
            "Proteção antiparasitária desatualizada. Tratamento obrigatório para proteção do ambiente coletivo.",
          price: SERVICE_PRICES.flea_tick_treatment,
        });
        notes.push(
          "🛡️ Tratamento antiparasitário obrigatório adicionado automaticamente."
        );
        riskPoints += 10;
      }
    }
  } else if (!step4.fleaTickActive) {
    autoServices.push({
      serviceType: "flea_tick_treatment",
      mandatory: true,
      reason:
        "Sem proteção antiparasitária ativa. Tratamento obrigatório para entrada no hotel.",
      price: SERVICE_PRICES.flea_tick_treatment,
    });
    notes.push(
      "🛡️ Tratamento antiparasitário obrigatório adicionado automaticamente."
    );
    riskPoints += 15;
  }

  if (step4.longNails) {
    autoServices.push({
      serviceType: "nail_trimming",
      mandatory: true,
      reason:
        "Unhas longas podem machucar outros animais e a equipe. Corte obrigatório.",
      price: SERVICE_PRICES.nail_trimming,
    });
    notes.push(
      "✂️ Corte de unhas obrigatório adicionado automaticamente por unhas longas."
    );
    riskPoints += 5;
  }

  if (step4.earIssues) {
    notes.push(
      "👂 Problemas auriculares informados. Higiene dos ouvidos recomendada."
    );
    riskPoints += 5;
  }

  if (step4.skinIssues) {
    notes.push("🔍 Problemas de pele informados. Inspeção na entrada.");
    riskPoints += 5;
  }

  return { autoServices, notes, riskPoints };
}

// ---- Calculate sanitary score (0-100, lower = riskier) ----
function calcSanitaryScore(riskPoints: number): number {
  return Math.max(0, 100 - riskPoints);
}

// ---- Determine risk level ----
function calcRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "low";
  if (score >= 60) return "medium";
  if (score >= 40) return "high";
  return "critical";
}

// ---- Main engine entry point ----
export function runAssessmentEngine(
  step2: Step2Values,
  step3: Step3Values,
  step4: Step4Values
): AssessmentResult {
  const { warnings: vaccineWarnings, autoServices: vaccineServices } =
    evaluateVaccines(step3);
  const {
    autoServices: behaviorServices,
    notes: behaviorNotes,
    riskPoints: behaviorRisk,
  } = evaluateBehavior(step2);
  const {
    autoServices: parasiteServices,
    notes: parasiteNotes,
    riskPoints: parasiteRisk,
  } = evaluateParasites(step4);

  const autoServices = [...vaccineServices, ...behaviorServices, ...parasiteServices];

  const vaccineRisk = vaccineWarnings.reduce((acc, w) => {
    if (w.status === "expired" || w.status === "missing") return acc + 15;
    if (w.status === "expiring_soon") return acc + 5;
    return acc;
  }, 0);

  const totalRisk = vaccineRisk + behaviorRisk + parasiteRisk;
  const sanitaryScore = calcSanitaryScore(totalRisk);
  const riskLevel = calcRiskLevel(sanitaryScore);

  const hasWarnings =
    vaccineWarnings.length > 0 ||
    behaviorNotes.length > 0 ||
    parasiteNotes.length > 0;

  const status: AssessmentStatus = hasWarnings
    ? "APPROVED_WITH_WARNINGS"
    : "APPROVED";

  const sanitaryNotes = [
    ...vaccineWarnings.map((w) => w.message),
    ...parasiteNotes,
  ];

  const operationalNotes = [
    ...behaviorNotes,
    ...(step2.separationAnxiety
      ? ["Atenção especial para ansiedade de separação."]
      : []),
    ...(step2.energyLevel === "high"
      ? ["Pet de alta energia — garantir atividade física adequada."]
      : []),
    ...(step4.earIssues ? ["Verificar ouvidos na entrada."] : []),
    ...(step4.skinIssues ? ["Inspecionar pele/pelagem na entrada."] : []),
  ];

  return {
    status,
    riskLevel,
    sanitaryScore,
    vaccineWarnings,
    autoServices,
    sanitaryNotes,
    operationalNotes,
  };
}
