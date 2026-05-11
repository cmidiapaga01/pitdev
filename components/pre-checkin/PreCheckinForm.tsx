"use client";

import { useState, useEffect, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { ProgressIndicator } from "@/components/pre-checkin/ProgressIndicator";
import { Step1TutorInfo } from "@/components/pre-checkin/steps/Step1TutorInfo";
import { Step2PetInfo } from "@/components/pre-checkin/steps/Step2PetInfo";
import { Step3Vaccines } from "@/components/pre-checkin/steps/Step3Vaccines";
import { Step4Parasites } from "@/components/pre-checkin/steps/Step4Parasites";
import { Step5IncludedServices } from "@/components/pre-checkin/steps/Step5IncludedServices";
import { Step6OptionalServices } from "@/components/pre-checkin/steps/Step6OptionalServices";
import { Step7Terms } from "@/components/pre-checkin/steps/Step7Terms";
import { AssessmentResult } from "@/components/pre-checkin/AssessmentResult";
import { runAssessmentEngine } from "@/lib/assessment-engine";
import { submitAssessment } from "@/app/actions/assessment";
import type { FullFormData, AssessmentResult as Result } from "@/types/assessment";
import type { BookingInfo } from "@/app/actions/bookings";
import type {
  Step1Values,
  Step2Values,
  Step3Values,
  Step4Values,
  Step5Values,
  Step6Values,
  Step7Values,
} from "@/lib/schemas";

const DRAFT_KEY = "pitpet_precheckin_draft";
const _TOTAL_STEPS = 7;

function formatBookingDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "dd 'de' MMM", { locale: ptBR });
  } catch {
    return dateStr;
  }
}

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 32 : -32, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 32 : -32, opacity: 0 }),
};

function serializeDraft(data: Partial<FullFormData>): string {
  // Strip File objects (can't serialize)
  const safe = JSON.parse(
    JSON.stringify(data, (_, v) => (v instanceof File ? undefined : v))
  );
  return JSON.stringify(safe);
}

export function PreCheckinForm({
  booking,
  bookingToken,
}: {
  booking?: BookingInfo;
  bookingToken?: string;
}) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<Partial<FullFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    assessmentId?: string;
    status?: string;
    result?: Result;
    error?: string;
  } | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setFormData(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Autosave draft on every change
  const saveDraft = useCallback((data: Partial<FullFormData>) => {
    try {
      localStorage.setItem(DRAFT_KEY, serializeDraft(data));
    } catch {
      // ignore
    }
  }, []);

  function goTo(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStep1(data: Step1Values) {
    const updated = { ...formData, step1: data };
    setFormData(updated);
    saveDraft(updated);
    goTo(2);
  }

  function handleStep2(data: Step2Values) {
    const updated = { ...formData, step2: data };
    setFormData(updated);
    saveDraft(updated);
    goTo(3);
  }

  function handleStep3(data: Step3Values) {
    const updated = { ...formData, step3: data };
    setFormData(updated);
    saveDraft(updated);
    goTo(4);
  }

  function handleStep4(data: Step4Values) {
    const updated = { ...formData, step4: data };
    setFormData(updated);
    saveDraft(updated);
    goTo(5);
  }

  function handleStep5(data: Step5Values) {
    const updated = { ...formData, step5: data };
    setFormData(updated);
    saveDraft(updated);
    goTo(6);
  }

  function handleStep6(data: Step6Values) {
    const updated = { ...formData, step6: data };
    setFormData(updated);
    saveDraft(updated);
    goTo(7);
  }

  async function handleStep7(data: Step7Values) {
    if (!formData.step2 || !formData.step3 || !formData.step4) return;

    setIsSubmitting(true);

    const full: FullFormData = {
      step1: formData.step1!,
      step2: formData.step2,
      step3: formData.step3,
      step4: formData.step4,
      step5: formData.step5 ?? {
        preCheckoutBath: true,
        pawHygiene: true,
        coatBrushing: true,
        wellnessCheck: true,
        wellbeingReport: true,
      },
      step6: formData.step6 ?? {
        earCleaning: false,
        dentalBrushing: false,
        calmingSpa: false,
        hydrationTreatment: false,
        photoUpdates: false,
      },
      step7: data,
    };

    // Compute assessment locally to show result immediately
    const engineResult = runAssessmentEngine(
      full.step2,
      full.step3,
      full.step4
    );

    try {
      const response = await submitAssessment(full, bookingToken);
      if (!response.success) {
        alert(`Erro ao salvar: ${response.error}`);
        setIsSubmitting(false);
        return;
      }
      setSubmitResult({
        ...response,
        result: engineResult,
      });
      // Clear draft on success
      localStorage.removeItem(DRAFT_KEY);
    } catch (err) {
      alert(`Erro inesperado: ${err instanceof Error ? err.message : String(err)}`);
      setIsSubmitting(false);
      return;
    } finally {
      setIsSubmitting(false);
    }
  }

  // Submitted — show result
  if (submitResult) {
    return (
      <AssessmentResult
        result={submitResult.result!}
        petName={formData.step2?.petName ?? "Seu pet"}
        assessmentId={submitResult.assessmentId}
        booking={booking}
      />
    );
  }

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-[#fff5f4] border border-[#ffd4d4] rounded-full px-4 py-1.5 text-xs font-semibold text-[#f07070] mb-3">
          🐾 Pré-Check-In Oficial
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2c1810]">
          Triagem Sanitária & Pré-Check-In
        </h1>
        <p className="text-sm text-[#8a6050] mt-1 max-w-md mx-auto">
          Complete o formulário para garantir uma hospedagem segura e
          personalizada para o seu pet.
        </p>
      </div>

      {/* Progress */}
      {booking && (
        <div
          style={{
            background: "linear-gradient(135deg, #f07070 0%, #e05555 100%)",
            borderRadius: "1rem",
            padding: "1rem 1.25rem",
            color: "#fff",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>🏠</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>
              Sua reserva está quase confirmada!
            </p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.82rem", opacity: 0.9 }}>
              {formatBookingDate(booking.checkIn)} → {formatBookingDate(booking.checkOut)}{" "}
              &nbsp;·&nbsp; {booking.nights} noite{booking.nights !== 1 ? "s" : ""}{" "}
              &nbsp;·&nbsp; {booking.weightLabel}
              &nbsp;·&nbsp; <strong>R$ {booking.subtotal.toFixed(2)}</strong>
            </p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.78rem", opacity: 0.8 }}>
              Preencha o formulário abaixo para concluir o pré-check-in. ✨
            </p>
          </div>
        </div>
      )}

      <ProgressIndicator currentStep={step} />

      {/* Form steps with animation */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {step === 1 && (
            <Step1TutorInfo
              defaultValues={formData.step1}
              onNext={handleStep1}
            />
          )}
          {step === 2 && (
            <Step2PetInfo
              defaultValues={formData.step2}
              onNext={handleStep2}
              onBack={() => goTo(1)}
            />
          )}
          {step === 3 && (
            <Step3Vaccines
              defaultValues={formData.step3}
              onNext={handleStep3}
              onBack={() => goTo(2)}
            />
          )}
          {step === 4 && (
            <Step4Parasites
              defaultValues={formData.step4}
              onNext={handleStep4}
              onBack={() => goTo(3)}
            />
          )}
          {step === 5 && (
            <Step5IncludedServices
              defaultValues={formData.step5}
              onNext={handleStep5}
              onBack={() => goTo(4)}
            />
          )}
          {step === 6 && (
            <Step6OptionalServices
              defaultValues={formData.step6}
              onNext={handleStep6}
              onBack={() => goTo(5)}
            />
          )}
          {step === 7 && (
            <Step7Terms
              defaultValues={formData.step7}
              onNext={handleStep7}
              onBack={() => goTo(6)}
              isSubmitting={isSubmitting}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons — fixed to viewport bottom */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "linear-gradient(to top, #fff5f4 80%, transparent)",
          paddingTop: "0.75rem",
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <div style={{ maxWidth: "42rem", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
        <button
          type="button"
          onClick={() => goTo(step - 1)}
          style={{
            visibility: step === 1 ? "hidden" : "visible",
            backgroundColor: "#ffffff",
            color: "#8a6050",
            padding: "0.875rem 1.25rem",
            borderRadius: "0.75rem",
            border: "1px solid #ffd4d4",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "background-color 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          ← Voltar
        </button>
        <button
          form="precheckin-form"
          type="submit"
          disabled={isSubmitting}
          style={{
            flex: 1,
            backgroundColor: isSubmitting ? "#f0a0a0" : "#f07070",
            color: "#ffffff",
            padding: "0.875rem 2rem",
            borderRadius: "0.75rem",
            fontWeight: 700,
            fontSize: "1rem",
            boxShadow: "0 2px 8px rgba(240,112,112,0.35)",
            border: "none",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "background-color 0.15s, transform 0.1s",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Enviando...
            </>
          ) : step === 7 ? "Enviar Pré-Check-In ✓" : "Próximo →"}
        </button>
        </div>
      </div>

    </div>
  );
}
