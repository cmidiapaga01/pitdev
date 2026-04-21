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

/** Index into WEIGHT_TIERS array (0=small, 1=medium, 2=large, 3=giant) */
export type PetWeightTier = 0 | 1 | 2 | 3;

export interface PetWeight {
  tier: PetWeightTier;
}

export interface BookingSearchParams {
  location: string;
  dates: DateRange;
  petWeight: PetWeight;
}
