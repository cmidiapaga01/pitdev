export interface Location {
  value: string;
  label: string;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface Guests {
  adults: number;
  children: number;
}

export interface BookingSearchParams {
  location: string;
  dates: DateRange;
  guests: Guests;
}
