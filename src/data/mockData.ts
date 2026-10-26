import { Car, ReturnStation, Reservation, ClientUser, AdminUser, FinancialTransaction, RegisteredClientRecord, ClientInquiry } from '../types/rental';

export const RETURN_STATIONS: ReturnStation[] = [
  {
    id: 'st-san-sebastian',
    name: 'ALBETH TRANSPORT (Cars for any occasions)',
    address: 'Maharlika Highway, Poblacion, San Sebastian, Samar',
    municipality: 'San Sebastian',
    province: 'Samar',
    lat: 11.7142,
    lng: 124.9653,
    availableBays: 10,
    operatingHours: '24/7 Operations & Dispatch',
    is24Hours: true,
    phone: '+63 (055) 543-8821 / +63 917 882 4011',
    isHeadOffice: true
  },
  {
    id: 'st-catbalogan',
    name: 'ALBETH Catbalogan Samar Station',
    address: 'Provincial Capitol Complex, Maharlika Hwy, Catbalogan City, Samar',
    municipality: 'Catbalogan City',
    province: 'Samar',
    lat: 11.7753,
    lng: 124.8860,
    availableBays: 8,
    operatingHours: '06:00 AM - 10:00 PM',
    is24Hours: false,
    phone: '+63 (055) 543-9022'
  },
  {
    id: 'st-tacloban-airport',
    name: 'ALBETH Tacloban DZR Airport Hub',
    address: 'Arrivals Terminal, Daniel Z. Romualdez Airport, San Jose, Tacloban City, Leyte',
    municipality: 'Tacloban City',
    province: 'Leyte',
    lat: 11.2281,
    lng: 125.0285,
    availableBays: 16,
    operatingHours: '24/7 Flight Meet & Greet',
    is24Hours: true,
    phone: '+63 (053) 832-7711'
  },
  {
    id: 'st-calbayog',
    name: 'ALBETH Calbayog City Hub',
    address: 'Maharlika Highway, Barangay Dagum, Calbayog City, Samar',
    municipality: 'Calbayog City',
    province: 'Samar',
    lat: 12.0674,
    lng: 124.5954,
    availableBays: 6,
    operatingHours: '07:00 AM - 09:00 PM',
    is24Hours: false,
    phone: '+63 (055) 533-4190'
  },
  {
    id: 'st-ormoc-port',
    name: 'ALBETH Ormoc Port Terminal',
    address: 'Pier 2 Passenger Concourse, Port Area, Ormoc City, Leyte',
    municipality: 'Ormoc City',
    province: 'Leyte',
    lat: 11.0050,
    lng: 124.6075,
    availableBays: 8,
    operatingHours: '05:30 AM - 11:00 PM (Ferry Schedule)',
    is24Hours: false,
    phone: '+63 (053) 561-2290'
  },
  {
    id: 'st-borongan',
    name: 'ALBETH Borongan Eastern Samar Station',
    address: 'Real Street, Poblacion, Borongan City, Eastern Samar',
    municipality: 'Borongan City',
    province: 'Eastern Samar',
    lat: 11.6080,
    lng: 125.4318,
    availableBays: 5,
    operatingHours: '07:00 AM - 08:00 PM',
    is24Hours: false,
    phone: '+63 (055) 560-9110'
  }
];

export const INITIAL_CARS: Car[] = [
  {
    id: 'car-mirage-g4',
    model: 'Mitsubishi Mirage G4 (AT)',
    brand: 'Mitsubishi',
    year: 2024,
    category: 'Subcompact Sedan',
    distance: 450,
    fuelCapacity: 42,
    pricePerHour: 160,
    pricePerDay: 1600,
    image: '/car_assets/fleet_mirage_g4.jpg',
    topViewImage: '/car_assets/fleet_mirage_g4.jpg',
    acceleration: '0-100 km/h in 11.5s',
    transmission: 'Automatic',
    seats: 5,
    engineType: '1.2L DOHC 12V 3-Cylinder MIVEC Gas (78 HP)',
    rating: 4.9,
    isAvailable: true,
    plateNumber: 'EAA-4812',
    features: [
      'Automatic CVT Transmission',
      '5 Passenger Seating',
      'Ultra Fuel Efficient (21 km/L)',
      'Touchscreen Infotainment w/ Apple CarPlay',
      'Cold Dual Aircon & USB Ports',
      'Equipped with Region 8 GPS Telemetry'
    ],
    currentGps: {
      lat: 11.7145,
      lng: 124.9658,
      address: 'ALBETH Main Office, Poblacion, San Sebastian, Samar',
      speedKmH: 0,
      fuelPercent: 95,
      batteryPercent: 100,
      isLocked: true,
      engineOn: false,
      odometerKm: 14210
    }
  },
  {
    id: 'car-ecosport',
    model: 'Ford EcoSport Titanium (AT)',
    brand: 'Ford',
    year: 2023,
    category: 'Crossover SUV',
    distance: 520,
    fuelCapacity: 52,
    pricePerHour: 230,
    pricePerDay: 2300,
    image: '/car_assets/fleet_ecosport.jpg',
    topViewImage: '/car_assets/fleet_ecosport.jpg',
    acceleration: '0-100 km/h in 10.2s',
    transmission: 'Automatic',
    seats: 5,
    engineType: '1.5L Ti-VCT Inline-4 (123 HP / 150 Nm)',
    rating: 4.95,
    isAvailable: true,
    plateNumber: 'HAA-9120',
    features: [
      '6-Speed Automatic w/ SelectShift',
      '5 Passenger Seating',
      '209mm High Ground Clearance (Ideal for Samar-Leyte roads)',
      'SYNC 3 Touchscreen & Reverse Camera',
      'Sunroof & Leather Seats',
      'Electronic Stability Control'
    ],
    currentGps: {
      lat: 11.7350,
      lng: 124.9420,
      address: 'En route Maharlika Hwy near San Sebastian & Catbalogan border, Samar',
      speedKmH: 42,
      fuelPercent: 84,
      batteryPercent: 97,
      isLocked: true,
      engineOn: true,
      odometerKm: 26340
    }
  },
  {
    id: 'car-tamaraw-gl',
    model: 'Toyota Tamaraw 2.4 GL Utility Van DSL A/T',
    brand: 'Toyota',
    year: 2024,
    category: 'Commercial Van',
    distance: 680,
    fuelCapacity: 65,
    pricePerHour: 290,
    pricePerDay: 2900,
    image: '/car_assets/fleet_tamaraw_gl.jpg',
    topViewImage: '/car_assets/fleet_tamaraw_gl.jpg',
    acceleration: '0-100 km/h in 11.0s',
    transmission: 'Automatic',
    seats: 9,
    engineType: '2.4L 2GD-FTV 4-Cyl D-4D Turbo Diesel (150 HP / 400 Nm)',
    rating: 5.0,
    isAvailable: true,
    plateNumber: 'NAA-3388',
    features: [
      '6-Speed Automatic Transmission (A/T)',
      'Utility Van Enclosed Cabin with 9-Passenger Seating',
      'Powerful 2.4L D-4D Turbo Diesel (400 Nm Torque for Samar-Leyte roads)',
      'Dual High-Cooling Aircon System (Front & Rear Cabin)',
      'Heavy-Duty High-Payload Commercial Suspension',
      'Integrated Fleet GPS Return Sensor'
    ],
    currentGps: {
      lat: 11.2281,
      lng: 125.0285,
      address: 'ALBETH Tacloban DZR Airport Bay #4, Leyte',
      speedKmH: 0,
      fuelPercent: 90,
      batteryPercent: 99,
      isLocked: true,
      engineOn: false,
      odometerKm: 9450
    }
  },
  {
    id: 'car-l300-fb',
    model: 'Mitsubishi L300 FB (MT)',
    brand: 'Mitsubishi',
    year: 2024,
    category: 'Commercial Van',
    distance: 580,
    fuelCapacity: 55,
    pricePerHour: 260,
    pricePerDay: 2600,
    image: '/car_assets/fleet_l300_fb.jpg',
    topViewImage: '/car_assets/fleet_l300_fb.jpg',
    acceleration: '0-100 km/h in 14.5s',
    transmission: 'Manual',
    seats: 17,
    engineType: '2.2L 4N14 Common Rail Turbocharged Diesel Euro 4 (99 HP / 200 Nm)',
    rating: 4.85,
    isAvailable: true,
    plateNumber: 'HAA-7741',
    features: [
      '5-Speed Heavy-Duty Manual Transmission',
      '17-Passenger Seating (Dual Rear Bench Rows)',
      'Front & Rear Dual Air-Conditioning System',
      'Heavy-Duty Commercial Cargo & People Mover',
      'Maximum Reliability across Region 8 Inter-Towns',
      'Equipped with 24/7 Roadside Assistance'
    ],
    currentGps: {
      lat: 11.7142,
      lng: 124.9653,
      address: 'ALBETH Central Depot, San Sebastian, Samar',
      speedKmH: 0,
      fuelPercent: 92,
      batteryPercent: 100,
      isLocked: true,
      engineOn: false,
      odometerKm: 31200
    }
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [];

export const CURRENT_USER: ClientUser = {
  id: 'client-guest',
  name: 'Client Guest',
  email: '',
  phone: '',
  driverLicense: '',
  address: 'San Sebastian, Samar, Region 8',
  avatar: '/car_assets/user.png',
  walletBalance: 0,
  membershipTier: 'ALBETH Member (Region 8)',
  memberSince: '2026',
  totalTrips: 0,
  points: 0
};

export const DEFAULT_ADMIN_USER: AdminUser = {
  id: 'admin-allan-01',
  name: 'Allan Pacoma',
  email: 'allanpacoma@gmail.com',
  phone: '+63 917 882 4011',
  role: 'Central Dispatcher',
  stationHub: 'San Sebastian Central Terminal, Samar (HQ)',
  avatar: '/car_assets/user.png',
  lastLogin: new Date().toISOString()
};

export const INITIAL_CLIENTS: RegisteredClientRecord[] = [
  {
    id: 'client-01',
    name: 'Roberto Veloso',
    phone: '+63 917 482 1102',
    email: 'roberto.veloso@yahoo.com',
    driverLicense: 'N02-18-048192 (LTO Tacloban)',
    address: 'Tacloban City, Leyte',
    registeredAt: new Date(Date.now() - 5 * 86400 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    totalBookings: 3
  },
  {
    id: 'client-02',
    name: 'Elena Tan-Chua',
    phone: '+63 928 554 9921',
    email: 'elena.chua@gmail.com',
    driverLicense: 'N03-20-093120 (LTO Catbalogan)',
    address: 'Catbalogan City, Samar',
    registeredAt: new Date(Date.now() - 12 * 86400 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    totalBookings: 2
  },
  {
    id: 'client-03',
    name: 'Engr. Daniel Ramirez',
    phone: '+63 908 772 3144',
    email: 'danny.ramirez@construction.ph',
    driverLicense: 'N01-16-002914 (LTO Calbayog)',
    address: 'Calbayog City, Samar',
    registeredAt: new Date(Date.now() - 20 * 86400 * 1000).toISOString(),
    lastLoginAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    totalBookings: 5
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-8801',
    type: 'rental_charge',
    bookingCode: 'ALB-R8-2026-4019',
    clientName: 'Roberto Veloso',
    clientPhone: '+63 917 482 1102',
    carModel: 'Toyota Tamaraw 2.4 GL Utility Van DSL A/T',
    amount: 5800.00,
    paymentMethod: 'GCash',
    status: 'paid',
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    notes: '2-Day Samar-Leyte Provincial Tour Booking'
  },
  {
    id: 'tx-8802',
    type: 'rental_charge',
    bookingCode: 'ALB-R8-2026-3820',
    clientName: 'Elena Tan-Chua',
    clientPhone: '+63 928 554 9921',
    carModel: 'Mitsubishi Mirage G4 (AT)',
    amount: 1600.00,
    paymentMethod: 'Maya',
    status: 'paid',
    timestamp: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    notes: 'Catbalogan to San Sebastian roundtrip'
  },
  {
    id: 'tx-8803',
    type: 'wallet_topup',
    clientName: 'Engr. Daniel Ramirez',
    clientPhone: '+63 908 772 3144',
    amount: 5000.00,
    paymentMethod: 'Cash (Hub)',
    status: 'paid',
    timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    notes: 'San Sebastian HQ Cash Counter Deposit'
  }
];

export const INITIAL_INQUIRIES: ClientInquiry[] = [
  {
    id: 'inq-901',
    clientName: 'Arch. Vincent De La Cruz',
    clientPhone: '+63 917 655 4321',
    clientEmail: 'vdelacruz.arch@gmail.com',
    inquiryType: 'Occasion / Event Rental',
    carModel: 'Toyota Tamaraw 2.4 GL Utility Van DSL A/T',
    preferredDate: 'November 15-18, 2026',
    destinationOrScope: 'San Sebastian to Guiuan, Eastern Samar wedding convoy',
    message: 'Good day Allan, we need a 9-seater reliable van for a 3-day family wedding convoy. What are the package rates?',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    status: 'sent_to_admin',
    adminNotes: 'Contacted via SMS, awaiting final guest count'
  },
  {
    id: 'inq-902',
    clientName: 'Grace Abella',
    clientPhone: '+63 920 883 9102',
    clientEmail: 'grace.abella@deped.gov.ph',
    inquiryType: 'Chauffeur / Driver Request',
    carModel: 'Mitsubishi L300 FB (MT)',
    preferredDate: 'Next Monday 8:00 AM',
    destinationOrScope: 'Tacloban Airport to Catbalogan DepEd Regional Office',
    message: 'Need 17-seater L300 with driver for school supplies and teacher delegation transfer across San Juanico Bridge.',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    status: 'sent_to_admin',
    adminNotes: 'Assigned Driver Rey'
  }
];


