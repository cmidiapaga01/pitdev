"use server";

import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "pitpet_admin_session";
const SESSION_VALUE  = "authenticated";

function safeCompare(a: string, b: string): boolean {
  // Prevent timing attacks even on strings of different length
  const aBuf = Buffer.from(a.padEnd(64));
  const bBuf = Buffer.from(b.padEnd(64));
  return timingSafeEqual(aBuf, bBuf) && a.length === b.length;
}

export async function adminLogin(formData: FormData): Promise<{ error: string } | never> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const validUser = process.env.ADMIN_USERNAME ?? "";
  const validPass = process.env.ADMIN_PASSWORD ?? "";

  if (!safeCompare(username, validUser) || !safeCompare(password, validPass)) {
    return { error: "Usuário ou senha incorretos." };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  redirect("/admin/bookings");
}

export async function adminLogout(): Promise<never> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
