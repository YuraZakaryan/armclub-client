import type { InferType } from 'yup';
import type { registrationSchema } from '~/schema/schema';
import type { TLoginFormData, TRegistrationFormData } from '~/types/user';

export interface IAuthLayoutProps {
  title: string;
  formData: TLoginFormData | TRegistrationFormData;
  handleSubmit: (data: TLoginFormData | TRegistrationFormData) => void;
  showTip?: boolean;
  submitTitle: string;
}

export type TLoginPayload = {
  login: string;
  password: string;
};

export type TAuthCredential = {
  error: string;
  ok: boolean;
  status: number;
  url: string;
};

export type TOtpState = {
  otp: string[];
};

export type RegistrationSchema = InferType<ReturnType<typeof registrationSchema>>;

export interface IAuthProps {
  hideButton?: boolean;
}
