import { apiRequest, DEMO_MODE, tokenStore } from "@/lib/api-client";
import { demoApi } from "@/lib/mock/demo-api";
import type { PasswordChangeInput, ProfileUpdateInput, RegisterInput, UserProfile } from "@/lib/types";

export async function registerUser(input: RegisterInput): Promise<UserProfile> {
  if (DEMO_MODE) return demoApi.register(input);
  return apiRequest<UserProfile>("/register", { method: "POST", body: input, auth: false });
}

export async function loginUser(username: string, password: string) {
  const tokens = DEMO_MODE
    ? await demoApi.login(username, password)
    : await apiRequest<{ access_token: string; refresh_token: string }>("/login", {
        method: "POST",
        form: { username, password, grant_type: "password" },
        auth: false,
      });
  tokenStore.set(tokens.access_token, tokens.refresh_token);
  return tokens;
}

export async function logoutUser() {
  const refresh = tokenStore.refresh;
  try {
    if (!DEMO_MODE && refresh) {
      await apiRequest("/logout/", { method: "POST", body: { refresh_token: refresh } });
    }
  } catch {
    // Even if the server call fails, clear the local session.
  } finally {
    tokenStore.clear();
  }
}

export async function fetchProfile(): Promise<UserProfile> {
  if (DEMO_MODE) return demoApi.me();
  return apiRequest<UserProfile>("/me");
}

export async function updateProfile(input: ProfileUpdateInput) {
  if (DEMO_MODE) return demoApi.updateProfile(input);
  return apiRequest<{ msg: string; data: UserProfile }>("/update_profile/", {
    method: "PUT",
    body: input,
  });
}

export async function changePassword(input: PasswordChangeInput) {
  if (DEMO_MODE) return demoApi.changePassword(input);
  return apiRequest<{ msg: string }>("/change_password/", { method: "PUT", body: input });
}

export async function sendProfileOtp(purpose: "update_email" | "update_phone", target: string) {
  if (DEMO_MODE) return demoApi.sendOtp();
  return apiRequest<{ msg: string }>("/send_profile_otp/", {
    method: "POST",
    body: { purpose, target },
  });
}

export async function sendPasswordOtp(channel: "email" | "phone") {
  if (DEMO_MODE) return demoApi.sendOtp();
  return apiRequest<{ msg: string }>("/send_password_otp/", { method: "POST", body: { channel } });
}

export async function deleteAccount() {
  if (DEMO_MODE) {
    const res = await demoApi.deleteAccount();
    tokenStore.clear();
    return res;
  }
  const res = await apiRequest<{ msg: string }>("/delete_account/", { method: "DELETE" });
  tokenStore.clear();
  return res;
}
