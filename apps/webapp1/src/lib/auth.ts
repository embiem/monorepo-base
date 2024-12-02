import { AuthTypes } from "@monorepo/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function login(
  credentials: AuthTypes.LoginCredentials,
): Promise<AuthTypes.AuthTokens> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  return data.data;
}

export async function register(
  data: AuthTypes.RegisterData,
): Promise<AuthTypes.AuthTokens> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  const result = await response.json();
  return result.data;
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

