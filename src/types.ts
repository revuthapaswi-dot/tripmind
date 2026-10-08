export type TravelCategory = 
  | 'Culture & Heritage'
  | 'Epicurean & Dining'
  | 'Nature & Scenic'
  | 'Tea & Coffee Culture'
  | 'Craft & Architecture'
  | 'Sanctuary & Stay';

export type BookingStatus = 'Confirmed' | 'Advance Booking Required' | 'Walk-in Welcome' | 'Reserved';

export interface TransitInfo {
  mode: 'walk' | 'train' | 'metro' | 'bus' | 'ferry' | 'drive';
  durationMinutes: number;
  description: string;
  distanceKm?: number;
}

export interface ItineraryStop {
  id: string;
  title: string;
  japaneseTitle?: string;
  italianTitle?: string;
  time: string; // e.g. "08:30"
  duration: string; // e.g. "90 mins"
  cost: string; // e.g. "¥2,000" or "€18"
  category: TravelCategory;
  neighborhood: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // percentage on custom canvas 0-100
    mapY: number; // percentage on custom canvas 0-100
  };
  image: string;
  editorialNotes: string;
  insiderTip: string;
  curatorQuote?: string;
  etiquetteNotes?: string;
  bestTimeOfDay?: string;
  bookingStatus: BookingStatus;
  transitToNext?: TransitInfo;
  isVisited?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  subtitle: string;
  date: string;
  weather: {
    temp: string;
    condition: string;
    icon: 'sunny' | 'cloudy' | 'rain' | 'crisp';
  };
  walkingDistanceKm: number;
  estimatedTransitTime: string;
  highlights: string[];
  stops: ItineraryStop[];
}

export interface TripLogistics {
  flights: Array<{
    flightNumber: string;
    airline: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
  }>;
  accommodations: Array<{
    name: string;
    type: string;
    checkIn: string;
    checkOut: string;
    neighborhood: string;
    confirmationCode: string;
    ratePerNight: string;
    image: string;
  }>;
  passes: Array<{
    name: string;
    type: string;
    validity: string;
    details: string;
  }>;
  budgetSummary: {
    totalEstimate: string;
    spent: string;
    breakdown: {
      stays: string;
      dining: string;
      experiences: string;
      transit: string;
    };
  };
}

export interface Trip {
  id: string;
  title: string;
  destination: string;
  country: string;
  subtitle: string;
  heroImage: string;
  season: string;
  recommendedDuration: string;
  curator: {
    name: string;
    role: string;
    avatar: string;
  };
  editorialPreamble: string;
  vibeTags: string[];
  days: ItineraryDay[];
  logistics: TripLogistics;
  mapCenter: {
    lat: number;
    lng: number;
    zoom: number;
  };
}
