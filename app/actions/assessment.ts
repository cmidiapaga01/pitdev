"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { runAssessmentEngine } from "@/lib/assessment-engine";
import type { FullFormData } from "@/types/assessment";
import type { VaccineType } from "@/types/assessment";

// ---- Main submission action ----
export async function submitAssessment(
  formData: FullFormData,
  bookingToken?: string
): Promise<{
  success: boolean;
  assessmentId?: string;
  status?: string;
  error?: string;
}> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { step1, step2, step3, step4, step5, step6, step7 } = formData;

  // Validate terms acceptance
  if (!step7.accuracyConfirmation) {
    return { success: false, error: "Confirmação de veracidade obrigatória." };
  }

  try {
    // 1. Create tutor
    const { data: tutor, error: tutorError } = await supabase
      .from("tutors")
      .insert({
        name: step1.tutorName,
        phone: step1.tutorPhone,
        email: step1.tutorEmail || null,
        emergency_contact: step1.emergencyContact,
      })
      .select()
      .single();

    if (tutorError) throw new Error(`Tutor insert: ${tutorError.message}`);

    // 2. Create pet
    const { data: pet, error: petError } = await supabase
      .from("pets")
      .insert({
        tutor_id: tutor.id,
        name: step2.petName,
        breed: step2.breed,
        birth_date: step2.birthDate || null,
        weight: parseFloat(step2.weight),
        gender: step2.gender,
        castrated: step2.castrated,
        temperament: step2.temperament,
        energy_level: step2.energyLevel,
        gets_along_dogs: step2.getsAlongDogs,
        gets_along_humans: step2.getsAlongHumans,
        separation_anxiety: step2.separationAnxiety,
        destructive_behavior: step2.destructiveBehavior,
        food_aggression: step2.foodAggression,
        has_bitten: step2.hasBitten,
      })
      .select()
      .single();

    if (petError) throw new Error(`Pet insert: ${petError.message}`);

    // 3. Save vaccines
    const vaccineEntries: Array<{
      type: VaccineType;
      appliedAt: string;
      expiresAt: string;
    }> = [
      { type: "rabies", ...step3.rabies },
      { type: "v8v10", ...step3.v8v10 },
      { type: "kennel_cough", appliedAt: step3.kennelCough.appliedAt, expiresAt: step3.kennelCough.expiresAt },
    ];

    // Run assessment engine to get vaccine statuses
    const engineResult = runAssessmentEngine(step2, step3, step4);

    const vaccineStatusMap: Record<VaccineType, string> = {
      rabies: "valid",
      v8v10: "valid",
      kennel_cough: "valid",
    };
    for (const w of engineResult.vaccineWarnings) {
      vaccineStatusMap[w.type] = w.status;
    }

    for (const entry of vaccineEntries) {
      await supabase.from("vaccines").insert({
        pet_id: pet.id,
        type: entry.type,
        applied_at: entry.appliedAt || null,
        expires_at: entry.expiresAt || null,
        proof_url: null,
        status: vaccineStatusMap[entry.type],
      });
    }

    // 4. Save parasite control
    await supabase.from("parasite_control").insert({
      pet_id: pet.id,
      last_deworming: step4.lastDeworming || null,
      flea_tick_active: step4.fleaTickActive,
      last_antiparasitic: step4.lastAntiparasitic || null,
      long_nails: step4.longNails,
      ear_issues: step4.earIssues,
      skin_issues: step4.skinIssues,
    });

    // 5. Create assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .insert({
        pet_id: pet.id,
        approved: engineResult.status === "APPROVED",
        status: engineResult.status,
        risk_level: engineResult.riskLevel,
        sanitary_notes: engineResult.sanitaryNotes,
        operational_notes: engineResult.operationalNotes,
        sanitary_score: engineResult.sanitaryScore,
      })
      .select()
      .single();

    if (assessmentError)
      throw new Error(`Assessment insert: ${assessmentError.message}`);

    // 6. Create required services (auto-mandated + selected optional)
    const services = [
      // Auto-mandated from engine
      ...engineResult.autoServices.map((s) => ({
        assessment_id: assessment.id,
        service_type: s.serviceType,
        mandatory: true,
        reason: s.reason,
        price: s.price,
      })),
      // Included premium care
      ...(step5.preCheckoutBath
        ? [{ assessment_id: assessment.id, service_type: "pre_checkout_bath", mandatory: false, reason: "Incluso no pacote premium", price: 80 }]
        : []),
      ...(step5.pawHygiene
        ? [{ assessment_id: assessment.id, service_type: "paw_hygiene", mandatory: false, reason: "Incluso no pacote premium", price: 20 }]
        : []),
      ...(step5.coatBrushing
        ? [{ assessment_id: assessment.id, service_type: "coat_brushing", mandatory: false, reason: "Incluso no pacote premium", price: 30 }]
        : []),
      ...(step5.wellnessCheck
        ? [{ assessment_id: assessment.id, service_type: "wellness_check", mandatory: false, reason: "Incluso no pacote premium", price: 50 }]
        : []),
      ...(step5.wellbeingReport
        ? [{ assessment_id: assessment.id, service_type: "wellbeing_report", mandatory: false, reason: "Incluso no pacote premium", price: 40 }]
        : []),
      // Optional premium services
      ...(step6.earCleaning
        ? [{ assessment_id: assessment.id, service_type: "ear_cleaning", mandatory: false, reason: "Serviço opcional selecionado", price: 30 }]
        : []),
      ...(step6.dentalBrushing
        ? [{ assessment_id: assessment.id, service_type: "dental_brushing", mandatory: false, reason: "Serviço opcional selecionado", price: 35 }]
        : []),
      ...(step6.calmingSpa
        ? [{ assessment_id: assessment.id, service_type: "calming_spa", mandatory: false, reason: "Serviço opcional selecionado", price: 60 }]
        : []),
      ...(step6.hydrationTreatment
        ? [{ assessment_id: assessment.id, service_type: "hydration_treatment", mandatory: false, reason: "Serviço opcional selecionado", price: 40 }]
        : []),
      ...(step6.photoUpdates
        ? [{ assessment_id: assessment.id, service_type: "photo_updates", mandatory: false, reason: "Serviço opcional selecionado", price: 20 }]
        : []),
    ];

    if (services.length > 0) {
      await supabase.from("required_services").insert(services);
    }

    // 7. Link booking to this assessment (if form was opened via a booking link)
    if (bookingToken) {
      await supabase
        .from("bookings")
        .update({
          assessment_id: assessment.id,
          tutor_id: tutor.id,
          status: "submitted",
        })
        .eq("precheckin_token", bookingToken);
    }

    return {
      success: true,
      assessmentId: assessment.id,
      status: engineResult.status,
    };
  } catch (err) {
    console.error("Assessment submission error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Erro ao salvar avaliação.",
    };
  }
}

// ---- Generate a short-lived signed URL for admin to view a vaccine proof ----
// storagePath is the value stored in vaccines.proof_url (e.g. "<petId>/rabies-1234.jpg")
export async function getVaccineProofSignedUrl(
  storagePath: string
): Promise<{ url: string | null; error?: string }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.storage
    .from("vaccine-proofs")
    .createSignedUrl(storagePath, 60 * 10); // valid for 10 minutes

  if (error) {
    return { url: null, error: error.message };
  }

  return { url: data.signedUrl };
}
