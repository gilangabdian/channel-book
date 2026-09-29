// State langkah pada proses Signup
export type SignupStep = 1 | 2;

// State langkah pada proses Login
export type LoginStep = 'email' | 'otp';

// Struktur data form Signup yang akan divalidasi
export interface SignupFormData {
  email: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}
