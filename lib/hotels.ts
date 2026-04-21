// Pet hotel "locations" / accommodation types
// TODO: expand with PitPet specific accommodation types

export interface PetHotel {
  id: string
  url: string
  name: string
  type: 'hotel' | 'creche' | 'banho-tosa'
}

export const allHotels: PetHotel[] = [
  { id: 'hotel-pequeno-medio', url: 'hotel-pequeno-medio', name: 'Hotel - Pequeno/Médio Porte', type: 'hotel' },
  { id: 'hotel-grande', url: 'hotel-grande', name: 'Hotel - Grande Porte', type: 'hotel' },
  { id: 'creche', url: 'creche', name: 'Creche', type: 'creche' },
]

// Compatibility type alias for booking components
export type HotelReview = {
  author_name: string
  rating: number
  text: string
  relative_time: string
  profile_photo?: string
}
