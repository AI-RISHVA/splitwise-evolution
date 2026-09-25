export type Gender = "male" | "female" | "other";

export interface UserProfile {
  id?: number;
  firstname: string;
  lastname: string;
  username: string;
  gender: Gender;
  mobile_no: string;
  email: string;
}

export interface RegisterInput {
  firstname: string;
  lastname: string;
  username: string;
  gender: Gender;
  mobile_no: string;
  email: string;
  password: string;
}

export interface ProfileUpdateInput {
  firstname?: string;
  lastname?: string;
  gender?: Gender;
  email?: string;
  email_otp?: string;
  mobile_no?: string;
  mobile_otp?: string;
}

export interface PasswordChangeInput {
  old_password: string;
  new_password: string;
  confirm_password: string;
  otp: string;
}
