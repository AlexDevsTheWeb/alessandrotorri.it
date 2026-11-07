import type { User } from "firebase/auth";

export interface AuthState {
  user: User | null;
  isAuthReady: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}