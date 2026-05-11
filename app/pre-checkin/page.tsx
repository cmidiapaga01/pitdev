import { getBookingByToken } from "@/app/actions/bookings";
import { PreCheckinForm } from "@/components/pre-checkin/PreCheckinForm";

interface Props {
  searchParams: Promise<{ t?: string }>;
}

export default async function PreCheckinPage({ searchParams }: Props) {
  const { t: token } = await searchParams;
  const booking = token ? await getBookingByToken(token) : undefined;

  return <PreCheckinForm booking={booking ?? undefined} bookingToken={token} />;
}
