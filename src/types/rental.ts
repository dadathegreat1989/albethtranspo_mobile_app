export interface Car {
  id: string;
  model: string;
  brand: string;
  year: number;
  category: 'Subcompact Sedan' | 'Crossover SUV' | 'Utility MPV' | 'Commercial Van';
  distance: number; // in km
  fuelCapacity: number; // in liters
  pricePerHour: number; // hourly rate in PHP (₱)
  pricePerDay: number; // daily rate in PHP (₱)
  image: string;
  topViewImage?: string;
  acceleration: string;
  transmission: 'Automatic' | 'Manual';
  seats: number;
  engineType: string;
  rating: number;
  isAvailable: boolean;
  plateNumber: string;
  features: string[];
  currentGps: {
    lat: number;
    lng: number;
    address: string;
    speedKmH: number;
    fuelPercent: number;
    batteryPercent: number;
    isLocked: boolean;
    engineOn: boolean;
    odometerKm: number;
  };
}

export interface ReturnStation {
  id: string;
  name: string;
  address: string;
  municipality: string;
  province: string;
  lat: number;
  lng: number;
  availableBays: number;
  operatingHours: string;
  is24Hours: boolean;
  phone: string;
  isHeadOffice?: boolean;
}

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  driverLicense: string;
  address: string;
  avatar: string;
  walletBalance: number;
  membershipTier: string;
  memberSince: string;
  totalTrips: number;
  points: number;
}

export interface Reservation {
  id: string;
  bookingCode: string;
  carId: string;
  car: Car;
  userId: string;
  userName: string;
  userPhone: string;
  pickupStationId: string;
  pickupStationName: string;
  returnStationId: string;
  returnStationName: string;
  pickupDateTime: string; // ISO string
  returnDateTime: string; // ISO string
  totalHours: number;
  rateType: 'hourly' | 'daily';
  subtotal: number;
  insuranceTier: 'standard' | 'premium' | 'zero_deductible';
  insuranceFee: number;
  addOns: {
    id: string;
    name: string;
    price: number;
  }[];
  totalPrice: number;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
  returnedAt?: string;
  returnInspection?: {
    returnStationId: string;
    finalOdometerKm: number;
    finalFuelPercent: number;
    exteriorCondition: 'excellent' | 'good' | 'minor_scratches' | 'needs_attention';
    cleanliness: 'clean' | 'moderate' | 'dirty';
    notes: string;
    inspectedBy: string;
    verifiedGpsDistanceMeters: number;
  };
}

export type AppTab = 'fleet' | 'gps' | 'reservations' | 'profile';

export type UserRole = 'client' | 'admin';

export type AdminDashboardTab = 'overview' | 'fleet' | 'bookings' | 'gps' | 'inquiries' | 'transactions' | 'clients';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Central Dispatcher' | 'Fleet Manager' | 'Super Admin';
  stationHub: string;
  avatar: string;
  lastLogin: string;
}

export interface RegisteredClientRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  driverLicense: string;
  address: string;
  registeredAt: string;
  lastLoginAt: string;
  totalBookings: number;
}

export interface FinancialTransaction {
  id: string;
  type: 'rental_charge' | 'wallet_topup' | 'security_deposit' | 'extension_charge' | 'add_on_fee';
  bookingCode?: string;
  clientName: string;
  clientPhone: string;
  carModel?: string;
  amount: number;
  paymentMethod: 'GCash' | 'Maya' | 'Cash (Hub)' | 'Credit Card';
  status: 'paid' | 'pending' | 'refunded';
  timestamp: string;
  notes?: string;
}

export interface ClientInquiry {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  inquiryType: 'Unit Booking Availability' | 'Occasion / Event Rental' | 'Chauffeur / Driver Request' | 'Rate Quotation' | 'General Inquiry';
  carId?: string;
  carModel?: string;
  preferredDate?: string;
  destinationOrScope?: string;
  message: string;
  createdAt: string;
  status: 'sent_to_admin' | 'pending';
  adminNotes?: string;
}

export interface AdminDispatchLogEntry {
  id: string;
  type: 'NEW_CLIENT_REGISTRATION' | 'NEW_UNIT_BOOKING' | 'CLIENT_INQUIRY';
  recipient: string;
  subject: string;
  summary: string;
  timestamp: string;
  success: boolean;
}

