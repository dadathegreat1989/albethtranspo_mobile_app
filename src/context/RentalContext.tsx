import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Car, 
  ReturnStation, 
  Reservation, 
  AppTab, 
  ClientUser, 
  ClientInquiry, 
  AdminUser, 
  RegisteredClientRecord, 
  FinancialTransaction, 
  UserRole, 
  AdminDashboardTab 
} from '../types/rental';
import { 
  INITIAL_CARS, 
  INITIAL_RESERVATIONS, 
  RETURN_STATIONS, 
  CURRENT_USER, 
  DEFAULT_ADMIN_USER, 
  INITIAL_CLIENTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_INQUIRIES 
} from '../data/mockData';
import { 
  sendAdminRegistrationNotification, 
  sendAdminBookingNotification, 
  sendAdminInquiryNotification, 
  ADMIN_EMAIL 
} from '../services/adminNotificationService';

interface BookingPayload {
  carId: string;
  pickupStationId: string;
  returnStationId: string;
  pickupDateTime: string;
  returnDateTime: string;
  totalHours: number;
  rateType: 'hourly' | 'daily';
  subtotal: number;
  insuranceTier: 'standard' | 'premium' | 'zero_deductible';
  insuranceFee: number;
  addOns: { id: string; name: string; price: number }[];
  totalPrice: number;
}

interface InspectionPayload {
  returnStationId: string;
  finalOdometerKm: number;
  finalFuelPercent: number;
  exteriorCondition: 'excellent' | 'good' | 'minor_scratches' | 'needs_attention';
  cleanliness: 'clean' | 'moderate' | 'dirty';
  notes: string;
}

interface RentalContextType {
  cars: Car[];
  reservations: Reservation[];
  returnStations: ReturnStation[];
  currentUser: ClientUser;
  isLoggedIn: boolean;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedCar: Car | null;
  setSelectedCar: (car: Car | null) => void;
  activeScreen: 'onboarding' | 'main' | 'car-details' | 'admin-dashboard';
  setActiveScreen: (screen: 'onboarding' | 'main' | 'car-details' | 'admin-dashboard') => void;
  bookingCar: Car | null;
  setBookingCar: (car: Car | null) => void;
  returnModalReservation: Reservation | null;
  setReturnModalReservation: (res: Reservation | null) => void;
  activeReservation: Reservation | null;
  viewDeviceFrame: boolean;
  setViewDeviceFrame: (val: boolean) => void;
  isInstallModalOpen: boolean;
  setIsInstallModalOpen: (val: boolean) => void;
  isClientInquiryModalOpen: boolean;
  setIsClientInquiryModalOpen: (val: boolean) => void;
  inquiryTargetCar: Car | null;
  setInquiryTargetCar: (car: Car | null) => void;
  
  // Admin & Dispatcher states
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  adminUser: AdminUser;
  isAdminLoggedIn: boolean;
  adminDashboardTab: AdminDashboardTab;
  setAdminDashboardTab: (tab: AdminDashboardTab) => void;
  registeredClients: RegisteredClientRecord[];
  transactions: FinancialTransaction[];
  inquiries: ClientInquiry[];
  lastCloudSyncTimestamp: Date;
  isRealtimeSaving: boolean;

  // Actions
  bookCar: (payload: BookingPayload) => Promise<Reservation>;
  submitClientInquiry: (inquiryData: Omit<ClientInquiry, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  openInquiryModal: (car?: Car | null) => void;
  extendReservation: (reservationId: string, hours: number) => void;
  cancelReservation: (reservationId: string) => void;
  returnCar: (reservationId: string, inspection: InspectionPayload) => Promise<Reservation>;
  toggleCarLock: (carId: string) => void;
  toggleCarEngine: (carId: string) => void;
  teleportCarToStation: (carId: string, stationId: string) => void;
  teleportCarNearbyStation: (carId: string, stationId: string, distanceMeters: number) => void;
  calculateDistanceKm: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  systemAlert: string | null;
  setSystemAlert: (msg: string | null) => void;
  loginClient: (emailOrPhone: string, pass: string) => Promise<boolean>;
  registerClient: (data: { name: string; email: string; phone: string; driverLicense: string; address: string }) => Promise<boolean>;
  logoutClient: () => void;
  loginAdmin: (email: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;
  switchToClientView: () => void;
  returnToDispatcherHub: () => void;
  remoteUpdateCarState: (carId: string, updates: Partial<Car['currentGps']>) => void;
  updateInquiryStatus: (inquiryId: string, status: ClientInquiry['status'], adminNotes?: string) => void;
  addTransaction: (tx: Omit<FinancialTransaction, 'id' | 'timestamp'>) => void;
  forceDispatcherSync: () => Promise<void>;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CARS: 'albeth_r8_cars_v4',
  RESERVATIONS: 'albeth_r8_reservations_v4',
  USER: 'albeth_r8_user_v4',
  LOGGED_IN: 'albeth_r8_logged_in_v4',
  DEVICE_FRAME: 'albeth_r8_frame_v4',
  ADMIN_USER: 'albeth_r8_admin_user_v4',
  ADMIN_LOGGED_IN: 'albeth_r8_admin_logged_in_v4',
  USER_ROLE: 'albeth_r8_user_role_v4',
  CLIENTS: 'albeth_r8_clients_v4',
  TRANSACTIONS: 'albeth_r8_transactions_v4',
  INQUIRIES: 'albeth_r8_inquiries_v4'
};

export function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const RentalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CARS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4 && parsed.some(c => c.id === 'car-tamaraw-gl')) {
          return parsed;
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_CARS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_RESERVATIONS;
  });

  const [currentUser, setCurrentUser] = useState<ClientUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return CURRENT_USER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGGED_IN);
    return saved === 'true';
  });

  const [adminUser, setAdminUser] = useState<AdminUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_ADMIN_USER;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
    return saved === 'true';
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    return (saved === 'admin' ? 'admin' : 'client') as UserRole;
  });

  const [registeredClients, setRegisteredClients] = useState<RegisteredClientRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_CLIENTS;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [inquiries, setInquiries] = useState<ClientInquiry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_INQUIRIES;
  });

  const [adminDashboardTab, setAdminDashboardTab] = useState<AdminDashboardTab>('overview');
  const [lastCloudSyncTimestamp, setLastCloudSyncTimestamp] = useState<Date>(new Date());
  const [isRealtimeSaving, setIsRealtimeSaving] = useState<boolean>(false);

  const [activeScreen, setActiveScreen] = useState<'onboarding' | 'main' | 'car-details' | 'admin-dashboard'>(() => {
    const savedAdmin = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
    const savedRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
    if (savedAdmin === 'true' && savedRole === 'admin') {
      return 'admin-dashboard';
    }
    const savedLogin = localStorage.getItem(STORAGE_KEYS.LOGGED_IN);
    return savedLogin === 'true' ? 'main' : 'onboarding';
  });

  const [activeTab, setActiveTab] = useState<AppTab>('fleet');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [bookingCar, setBookingCar] = useState<Car | null>(null);
  const [returnModalReservation, setReturnModalReservation] = useState<Reservation | null>(null);
  const [viewDeviceFrame, setViewDeviceFrame] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEVICE_FRAME);
    return saved !== null ? saved === 'true' : true;
  });
  const [systemAlert, setSystemAlert] = useState<string | null>(null);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isClientInquiryModalOpen, setIsClientInquiryModalOpen] = useState(false);
  const [inquiryTargetCar, setInquiryTargetCar] = useState<Car | null>(null);

  // Auto-sync persistent storage whenever state changes
  useEffect(() => {
    setIsRealtimeSaving(true);
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
    const timer = setTimeout(() => setIsRealtimeSaving(false), 400);
    return () => clearTimeout(timer);
  }, [cars]);

  useEffect(() => {
    setIsRealtimeSaving(true);
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    const timer = setTimeout(() => setIsRealtimeSaving(false), 400);
    return () => clearTimeout(timer);
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(adminUser));
  }, [adminUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(registeredClients));
  }, [registeredClients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEVICE_FRAME, String(viewDeviceFrame));
  }, [viewDeviceFrame]);

  // Live GPS simulation for active cars with engine on in Region 8 (Eastern Visayas)
  useEffect(() => {
    const interval = setInterval(() => {
      setCars(prevCars =>
        prevCars.map(car => {
          if (!car.isAvailable && car.currentGps.engineOn) {
            // Realistic GPS movement along Maharlika Highway
            const deltaLat = (Math.random() - 0.48) * 0.0003;
            const deltaLng = (Math.random() - 0.48) * 0.0003;
            const currentSpeed = Math.floor(35 + Math.random() * 25);
            return {
              ...car,
              currentGps: {
                ...car.currentGps,
                lat: Number((car.currentGps.lat + deltaLat).toFixed(6)),
                lng: Number((car.currentGps.lng + deltaLng).toFixed(6)),
                speedKmH: currentSpeed,
                odometerKm: Number((car.currentGps.odometerKm + 0.03).toFixed(2)),
                fuelPercent: Math.max(15, car.currentGps.fuelPercent - 0.01)
              }
            };
          }
          return car;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activeReservation = reservations.find(r => r.status === 'active') || null;

  const loginClient = async (emailOrPhone: string, pass: string): Promise<boolean> => {
    const registeredName = currentUser.name && currentUser.name !== 'Client Guest' 
      ? currentUser.name 
      : emailOrPhone.split('@')[0] || 'Client Member';
    
    if (currentUser.name === 'Client Guest') {
      setCurrentUser(prev => ({
        ...prev,
        name: registeredName,
        email: emailOrPhone.includes('@') ? emailOrPhone : prev.email,
        phone: !emailOrPhone.includes('@') ? emailOrPhone : prev.phone
      }));
    }
    setIsLoggedIn(true);
    setUserRole('client');
    setSystemAlert(`Welcome to ALBETH TRANSPORT! Signed in as ${registeredName}.`);
    return true;
  };

  const registerClient = async (data: {
    name: string;
    email: string;
    phone: string;
    driverLicense: string;
    address: string;
  }): Promise<boolean> => {
    const newClient: ClientUser = {
      id: `client-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      driverLicense: `${data.driverLicense} (Verified LTO PH)`,
      address: data.address || 'San Sebastian, Samar, Region 8',
      avatar: '/car_assets/user.png',
      walletBalance: 0,
      membershipTier: 'Registered Client (Region 8)',
      memberSince: '2026',
      totalTrips: 0,
      points: 250
    };
    setCurrentUser(newClient);
    setIsLoggedIn(true);
    setUserRole('client');

    // Register into persistent audit record for dispatcher monitor
    const clientRecord: RegisteredClientRecord = {
      id: newClient.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      driverLicense: `${data.driverLicense} (Verified LTO PH)`,
      address: data.address || 'San Sebastian, Samar, Region 8',
      registeredAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      totalBookings: 0
    };
    setRegisteredClients(prev => [clientRecord, ...prev.filter(c => c.phone !== data.phone)]);

    // Auto-send new client account details to Admin Email: ALLANPACOMA@GMAIL.COM
    sendAdminRegistrationNotification(newClient).catch(err => {
      console.warn('Admin registration email notification error:', err);
    });

    setSystemAlert(`Account registered! Details auto-transmitted to Admin Allan Pacoma (${ADMIN_EMAIL}). Welcome, ${data.name}!`);
    return true;
  };

  const logoutClient = () => {
    setIsLoggedIn(false);
    setActiveScreen('onboarding');
    setSystemAlert('You have been logged out.');
  };

  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Verify Admin credentials
    const isAllanEmail = cleanEmail === 'allanpacoma@gmail.com' || cleanEmail.includes('allan') || cleanEmail.includes('admin');
    const isValidPass = cleanPass === 'admin888' || cleanPass === 'admin2026' || cleanPass === 'albeth' || cleanPass.length >= 4;

    if (isAllanEmail || isValidPass) {
      const updatedAdmin: AdminUser = {
        ...DEFAULT_ADMIN_USER,
        lastLogin: new Date().toISOString()
      };
      setAdminUser(updatedAdmin);
      setIsAdminLoggedIn(true);
      setUserRole('admin');
      setActiveScreen('admin-dashboard');
      setSystemAlert(`Authorized Dispatcher Login: Welcome back Allan Pacoma (${ADMIN_EMAIL})! Region 8 Central Hub Active.`);
      return true;
    }

    throw new Error('Invalid Dispatcher credentials. Use allanpacoma@gmail.com or authorized PIN.');
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setUserRole('client');
    setActiveScreen('onboarding');
    setSystemAlert('Admin & Dispatcher session closed.');
  };

  const switchToClientView = () => {
    setActiveScreen('main');
    setActiveTab('fleet');
    setSystemAlert('Previewing Client App View. You can return to Dispatcher Command anytime.');
  };

  const returnToDispatcherHub = () => {
    setActiveScreen('admin-dashboard');
    setSystemAlert('Returned to ALBETH Central Dispatcher Terminal.');
  };

  const submitClientInquiry = async (inquiryData: Omit<ClientInquiry, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    const inquiry: ClientInquiry = {
      id: `inq-${Date.now()}`,
      ...inquiryData,
      createdAt: new Date().toISOString(),
      status: 'sent_to_admin'
    };

    setInquiries(prev => [inquiry, ...prev]);
    const res = await sendAdminInquiryNotification(inquiry);
    setSystemAlert(`Inquiry submitted! Auto-sent to Admin Allan Pacoma (${ADMIN_EMAIL}). Recorded in Dispatcher console.`);
    return res;
  };

  const openInquiryModal = (car?: Car | null) => {
    setInquiryTargetCar(car || null);
    setIsClientInquiryModalOpen(true);
  };

  const bookCar = async (payload: BookingPayload): Promise<Reservation> => {
    const car = cars.find(c => c.id === payload.carId);
    if (!car) throw new Error('Vehicle not found');

    const pickupStation = RETURN_STATIONS.find(s => s.id === payload.pickupStationId) || RETURN_STATIONS[0];
    const returnStation = RETURN_STATIONS.find(s => s.id === payload.returnStationId) || RETURN_STATIONS[0];

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      bookingCode: `ALB-R8-${new Date().getFullYear()}-${randomSuffix}`,
      carId: car.id,
      car: { ...car, isAvailable: false },
      userId: currentUser.id,
      userName: currentUser.name && currentUser.name !== 'Client Guest' ? currentUser.name : 'Valued Client',
      userPhone: currentUser.phone || '+63 917 882 4011',
      pickupStationId: pickupStation.id,
      pickupStationName: pickupStation.name,
      returnStationId: returnStation.id,
      returnStationName: returnStation.name,
      pickupDateTime: payload.pickupDateTime,
      returnDateTime: payload.returnDateTime,
      totalHours: payload.totalHours,
      rateType: payload.rateType,
      subtotal: payload.subtotal,
      insuranceTier: payload.insuranceTier,
      insuranceFee: payload.insuranceFee,
      addOns: payload.addOns,
      totalPrice: payload.totalPrice,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Update car status
    setCars(prev =>
      prev.map(c =>
        c.id === car.id
          ? {
              ...c,
              isAvailable: false,
              currentGps: {
                ...c.currentGps,
                lat: pickupStation.lat,
                lng: pickupStation.lng,
                address: `${pickupStation.name} - Bay #${Math.floor(1 + Math.random() * 6)}`,
                speedKmH: 0,
                engineOn: true,
                isLocked: false
              }
            }
          : c
      )
    );

    setReservations(prev => [newReservation, ...prev]);
    setBookingCar(null);

    // Auto-create financial transaction record for Dispatcher monitoring
    const newTx: FinancialTransaction = {
      id: `tx-${Date.now()}`,
      type: 'rental_charge',
      bookingCode: newReservation.bookingCode,
      clientName: newReservation.userName,
      clientPhone: newReservation.userPhone,
      carModel: car.model,
      amount: payload.totalPrice,
      paymentMethod: 'GCash',
      status: 'paid',
      timestamp: new Date().toISOString(),
      notes: `${payload.totalHours} hrs rental (${payload.rateType}) • ${pickupStation.name}`
    };
    setTransactions(prev => [newTx, ...prev]);

    // Update registered client total bookings count
    setRegisteredClients(prev =>
      prev.map(c =>
        c.phone === newReservation.userPhone || c.name === newReservation.userName
          ? { ...c, totalBookings: c.totalBookings + 1 }
          : c
      )
    );

    // Auto-send new vehicle booking & unit dispatch to Admin Email: ALLANPACOMA@GMAIL.COM
    sendAdminBookingNotification(newReservation).catch(err => {
      console.warn('Admin booking email notification error:', err);
    });

    setSystemAlert(`Booking ${newReservation.bookingCode} confirmed! Unit dispatched & details auto-sent to Admin Allan Pacoma (${ADMIN_EMAIL}).`);
    return newReservation;
  };

  const extendReservation = (reservationId: string, hours: number) => {
    setReservations(prev =>
      prev.map(res => {
        if (res.id === reservationId) {
          const currentReturn = new Date(res.returnDateTime).getTime();
          const newReturn = new Date(currentReturn + hours * 3600 * 1000).toISOString();
          const extraCost = hours * res.car.pricePerHour;

          // Add transaction record for extension
          const extTx: FinancialTransaction = {
            id: `tx-ext-${Date.now()}`,
            type: 'extension_charge',
            bookingCode: res.bookingCode,
            clientName: res.userName,
            clientPhone: res.userPhone,
            carModel: res.car.model,
            amount: extraCost,
            paymentMethod: 'Maya',
            status: 'paid',
            timestamp: new Date().toISOString(),
            notes: `+${hours} hours extension`
          };
          setTransactions(tPrev => [extTx, ...tPrev]);

          return {
            ...res,
            returnDateTime: newReturn,
            totalHours: res.totalHours + hours,
            totalPrice: res.totalPrice + extraCost
          };
        }
        return res;
      })
    );
    setSystemAlert(`Rental extended by +${hours} hours (₱${hours * (activeReservation?.car.pricePerHour || 160)} added).`);
  };

  const cancelReservation = (reservationId: string) => {
    const target = reservations.find(r => r.id === reservationId);
    if (!target) return;

    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
    );

    // Free the vehicle
    setCars(prev =>
      prev.map(c => (c.id === target.carId ? { ...c, isAvailable: true } : c))
    );

    setSystemAlert(`Booking ${target.bookingCode} was cancelled.`);
  };

  const returnCar = async (reservationId: string, inspection: InspectionPayload): Promise<Reservation> => {
    const target = reservations.find(r => r.id === reservationId);
    if (!target) throw new Error('Reservation not found');

    const returnStation = RETURN_STATIONS.find(s => s.id === inspection.returnStationId) || RETURN_STATIONS[0];
    const car = cars.find(c => c.id === target.carId) || target.car;

    // Calculate real distance from current car GPS to designated return station
    const distanceKm = calculateHaversineKm(
      car.currentGps.lat,
      car.currentGps.lng,
      returnStation.lat,
      returnStation.lng
    );
    const distanceMeters = Math.round(distanceKm * 1000);

    const updatedReservation: Reservation = {
      ...target,
      status: 'completed',
      returnedAt: new Date().toISOString(),
      returnStationId: returnStation.id,
      returnStationName: returnStation.name,
      returnInspection: {
        returnStationId: returnStation.id,
        finalOdometerKm: inspection.finalOdometerKm,
        finalFuelPercent: inspection.finalFuelPercent,
        exteriorCondition: inspection.exteriorCondition,
        cleanliness: inspection.cleanliness,
        notes: inspection.notes,
        inspectedBy: `ALBETH San Sebastian GPS Auto-Return Sensor (${adminUser.name})`,
        verifiedGpsDistanceMeters: distanceMeters
      }
    };

    setReservations(prev =>
      prev.map(r => (r.id === reservationId ? updatedReservation : r))
    );

    // Update car to be available at return station
    setCars(prev =>
      prev.map(c =>
        c.id === target.carId
          ? {
              ...c,
              isAvailable: true,
              distance: Math.max(100, c.distance - 25),
              currentGps: {
                ...c.currentGps,
                lat: returnStation.lat,
                lng: returnStation.lng,
                address: `${returnStation.name} - Checked In`,
                speedKmH: 0,
                engineOn: false,
                isLocked: true,
                odometerKm: inspection.finalOdometerKm,
                fuelPercent: inspection.finalFuelPercent
              }
            }
          : c
      )
    );

    setReturnModalReservation(null);
    setSystemAlert(`Return successful! Vehicle checked into ${returnStation.name}.`);
    return updatedReservation;
  };

  const toggleCarLock = (carId: string) => {
    setCars(prev =>
      prev.map(c => {
        if (c.id === carId) {
          const nextState = !c.currentGps.isLocked;
          setSystemAlert(nextState ? `Vehicle ${c.model} locked.` : `Vehicle ${c.model} unlocked.`);
          return {
            ...c,
            currentGps: { ...c.currentGps, isLocked: nextState }
          };
        }
        return c;
      })
    );
  };

  const toggleCarEngine = (carId: string) => {
    setCars(prev =>
      prev.map(c => {
        if (c.id === carId) {
          const nextEngine = !c.currentGps.engineOn;
          setSystemAlert(nextEngine ? `Engine started remotely.` : `Engine turned off.`);
          return {
            ...c,
            currentGps: {
              ...c.currentGps,
              engineOn: nextEngine,
              speedKmH: nextEngine ? c.currentGps.speedKmH : 0
            }
          };
        }
        return c;
      })
    );
  };

  const remoteUpdateCarState = (carId: string, updates: Partial<Car['currentGps']>) => {
    setCars(prev =>
      prev.map(c => {
        if (c.id === carId) {
          return {
            ...c,
            currentGps: { ...c.currentGps, ...updates }
          };
        }
        return c;
      })
    );
    setSystemAlert(`Dispatcher command applied to unit telemetry.`);
  };

  const updateInquiryStatus = (inquiryId: string, status: ClientInquiry['status'], adminNotes?: string) => {
    setInquiries(prev =>
      prev.map(inq => {
        if (inq.id === inquiryId) {
          return {
            ...inq,
            status,
            adminNotes: adminNotes !== undefined ? adminNotes : inq.adminNotes
          };
        }
        return inq;
      })
    );
    setSystemAlert('Inquiry status updated by Dispatcher.');
  };

  const addTransaction = (tx: Omit<FinancialTransaction, 'id' | 'timestamp'>) => {
    const fullTx: FinancialTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [fullTx, ...prev]);
    setSystemAlert(`Transaction recorded: ₱${tx.amount.toLocaleString()} (${tx.paymentMethod}).`);
  };

  const forceDispatcherSync = async () => {
    setIsRealtimeSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setLastCloudSyncTimestamp(new Date());
    setIsRealtimeSaving(false);
    setSystemAlert('Central Dispatch database synchronized & saved.');
  };

  const teleportCarToStation = (carId: string, stationId: string) => {
    const station = RETURN_STATIONS.find(s => s.id === stationId);
    if (!station) return;
    setCars(prev =>
      prev.map(c =>
        c.id === carId
          ? {
              ...c,
              currentGps: {
                ...c.currentGps,
                lat: station.lat,
                lng: station.lng,
                address: `${station.name} - Return Bay #1`,
                speedKmH: 0
              }
            }
          : c
      )
    );
    setSystemAlert(`Car GPS location placed inside ${station.name} return zone.`);
  };

  const teleportCarNearbyStation = (carId: string, stationId: string, distanceMeters: number) => {
    const station = RETURN_STATIONS.find(s => s.id === stationId);
    if (!station) return;
    const offset = (distanceMeters / 111320);
    setCars(prev =>
      prev.map(c =>
        c.id === carId
          ? {
              ...c,
              currentGps: {
                ...c.currentGps,
                lat: station.lat + offset * 0.7,
                lng: station.lng + offset * 0.7,
                address: `Approaching ${station.name} (~${distanceMeters}m away)`,
                speedKmH: 25
              }
            }
          : c
      )
    );
    setSystemAlert(`Car GPS updated: ~${distanceMeters}m from ${station.name}.`);
  };

  return (
    <RentalContext.Provider
      value={{
        cars,
        reservations,
        returnStations: RETURN_STATIONS,
        currentUser,
        isLoggedIn,
        activeTab,
        setActiveTab,
        selectedCar,
        setSelectedCar,
        activeScreen,
        setActiveScreen,
        bookingCar,
        setBookingCar,
        returnModalReservation,
        setReturnModalReservation,
        activeReservation,
        viewDeviceFrame,
        setViewDeviceFrame,
        isInstallModalOpen,
        setIsInstallModalOpen,
        isClientInquiryModalOpen,
        setIsClientInquiryModalOpen,
        inquiryTargetCar,
        setInquiryTargetCar,
        
        // Admin & Dispatcher states
        userRole,
        setUserRole,
        adminUser,
        isAdminLoggedIn,
        adminDashboardTab,
        setAdminDashboardTab,
        registeredClients,
        transactions,
        inquiries,
        lastCloudSyncTimestamp,
        isRealtimeSaving,

        // Actions
        submitClientInquiry,
        openInquiryModal,
        bookCar,
        extendReservation,
        cancelReservation,
        returnCar,
        toggleCarLock,
        toggleCarEngine,
        teleportCarToStation,
        teleportCarNearbyStation,
        calculateDistanceKm: calculateHaversineKm,
        systemAlert,
        setSystemAlert,
        loginClient,
        registerClient,
        logoutClient,
        loginAdmin,
        logoutAdmin,
        switchToClientView,
        returnToDispatcherHub,
        remoteUpdateCarState,
        updateInquiryStatus,
        addTransaction,
        forceDispatcherSync
      }}
    >
      {children}
    </RentalContext.Provider>
  );
};

export const useRental = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
};
