import { apiFetch, BASE_URL } from "@/shared/lib/api";

export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  role: "OWNER" | "ADMIN";
  storeId: number;
  storeName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserResponse;
}

export async function loginApi(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      (body as { message?: string }).message ?? "이메일 또는 비밀번호가 올바르지 않습니다.",
    );
  }

  return body as AuthResponse;
}

export async function getMeApi(): Promise<UserResponse> {
  return apiFetch<UserResponse>("/auth/me");
}
