// src/types/auth.ts
export interface AuthResponse {
  token: string;
  role: "ADMIN" | "CUSTOMER";
  name: string;
  email: string;
}
