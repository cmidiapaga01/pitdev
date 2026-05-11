import { Suspense } from "react";
import { RedirectClient } from "./RedirectClient";

export const metadata = { title: "Redirecionando… | PitPet Store" };

export default function RedirectPage() {
  return (
    <Suspense>
      <RedirectClient />
    </Suspense>
  );
}
