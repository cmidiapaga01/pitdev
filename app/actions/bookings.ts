"use server";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";

export interface BookingInfo {
  bookingId: string;
  checkIn: string;   // "yyyy-MM-dd"
  checkOut: string;  // "yyyy-MM-dd"
  nights: number;
  weightLabel: string;
  subtotal: number;
}

// ---- Create a booking from the landing page widget ----
export async function createBooking(params: {
  checkIn: string;
  checkOut: string;
  nights: number;
  weightTierIndex: number;
  weightLabel: string;
  subtotal: number;
}): Promise<{ success: true; bookingId: string } | { success: false; error: string }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      check_in: params.checkIn,
      check_out: params.checkOut,
      nights: params.nights,
      weight_tier_index: params.weightTierIndex,
      weight_label: params.weightLabel,
      subtotal: params.subtotal,
    })
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, bookingId: data.id };
}

// ---- Admin: generate a unique pre-checkin link for a booking ----
export async function generatePrecheckinToken(
  bookingId: string
): Promise<{ success: true; token: string; url: string } | { success: false; error: string }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const token = randomUUID();

  const { error } = await supabase
    .from("bookings")
    .update({ precheckin_token: token, status: "form_sent" })
    .eq("id", bookingId);

  if (error) return { success: false, error: error.message };

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://pitdev-mu.vercel.app";
  return { success: true, token, url: `${baseUrl}/pre-checkin?t=${token}` };
}

// ---- Admin: get all bookings ----
export async function getBookings(): Promise<
  Array<{
    id: string;
    check_in: string;
    check_out: string;
    nights: number;
    weight_label: string;
    subtotal: number;
    status: string;
    precheckin_token: string | null;
    created_at: string;
  }>
> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("bookings")
    .select("id, check_in, check_out, nights, weight_label, subtotal, status, precheckin_token, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ---- Load a booking by its pre-checkin token ----
export async function getBookingByToken(
  token: string
): Promise<BookingInfo | null> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("bookings")
    .select("id, check_in, check_out, nights, weight_label, subtotal")
    .eq("precheckin_token", token)
    .single();

  if (error || !data) return null;

  return {
    bookingId: data.id,
    checkIn: data.check_in,
    checkOut: data.check_out,
    nights: data.nights,
    weightLabel: data.weight_label,
    subtotal: data.subtotal,
  };
}

// ---- Link an assessment to a booking (called after form submission) ----
export async function linkAssessmentToBooking(
  token: string,
  assessmentId: string,
  tutorId: string
): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  await supabase
    .from("bookings")
    .update({ assessment_id: assessmentId, tutor_id: tutorId, status: "submitted" })
    .eq("precheckin_token", token);
}
