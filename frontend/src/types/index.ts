export interface User {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
  user_type: 'lender' | 'borrower' | 'both';
  profile_image?: string;
  credit_score?: number;
  verification_status: 'pending' | 'verified' | 'rejected';

  amount?: number;
  term?: number;

  location: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface LoanRequest {
  _id: string;
  amount: number;
  purpose: string;
  term: number; // in months
  maxRate: number;
  description: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'funded' | 'repaid';
  createdAt: string;
  updatedAt: string;

  borrower: {
    _id: string;
    fullName: string;
    email?: string;
    phone?: string;
    location?: {
      latitude: number;
      longitude: number;
      city: string;
      state: string;
    };
  };

  lender?: {
    _id: string;
    fullName: string;
    email?: string;
  };

  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface LoanOffer {
  _id: string;
  lender_id: string;
  loan_request_id?: string;
  amount: number;
  interest_rate: number;
  term_months: number;
  status: 'available' | 'matched' | 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
  lender?: User;
}

export interface LoanMatch {
  _id: string;
  loan_request_id: string;
  loan_offer_id: string;
  borrower_id: string;
  lender_id: string;
  amount: number;
  interest_rate: number;
  term_months: number;
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'defaulted';
  monthly_payment: number;
  total_amount: number;
  createdAt: string;
  updatedAt: string;
  borrower?: User;
  lender?: User;
  loan_request?: LoanRequest;
  loan_offer?: LoanOffer;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
