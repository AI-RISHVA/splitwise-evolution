/**
 * Demo-data adapter. Used while VITE_API_BASE_URL is not configured so the
 * whole UI stays clickable without a live FastAPI server.
 */
import type { PasswordChangeInput, ProfileUpdateInput, RegisterInput, UserProfile } from "@/lib/types";

const USER_KEY = "sw_demo_user";
const PASS_KEY = "sw_demo_password";

const defaultUser: UserProfile = {
  id: 1,
  firstname: "Demo",
  lastname: "User",
  username: "demouser",
  gender: "male",
  mobile_no: "9876543210",
  email: "demo@splitwise.app",
};

function read(): UserProfile {
  if (typeof window === "undefined") return defaultUser;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return defaultUser;
  try {
    return { ...defaultUser, ...(JSON.parse(raw) as UserProfile) };
  } catch {
    return defaultUser;
  }
}

function write(user: UserProfile) {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

const wait = () => new Promise((resolve) => setTimeout(resolve, 350));

export const demoApi = {
  async register(input: RegisterInput): Promise<UserProfile> {
    await wait();
    const user: UserProfile = { ...input, id: 1 };
    write(user);
    window.localStorage.setItem(PASS_KEY, input.password);
    return user;
  },
  async login(username: string, password: string) {
    await wait();
    const user = read();
    const stored = window.localStorage.getItem(PASS_KEY);
    if (username !== user.username || (stored && stored !== password)) {
      throw new Error("invalid username & password (demo: demouser / any password)");
    }
    return { access_token: "demo-access-token", refresh_token: "demo-refresh-token" };
  },
  async me(): Promise<UserProfile> {
    await wait();
    return read();
  },
  async updateProfile(input: ProfileUpdateInput): Promise<UserProfile> {
    await wait();
    const user = { ...read(), ...input } as UserProfile;
    write(user);
    return user;
  },
  async changePassword(input: PasswordChangeInput) {
    await wait();
    if (input.new_password !== input.confirm_password) {
      throw new Error("new password entered is not match with confirm password.");
    }
    window.localStorage.setItem(PASS_KEY, input.new_password);
    return { msg: "Password changed successfully (demo mode)." };
  },
  async sendOtp() {
    await wait();
    return { msg: "Demo OTP is 123456" };
  },
  async deleteAccount() {
    await wait();
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(PASS_KEY);
    return { msg: "Account deleted (demo mode)." };
  },
};
