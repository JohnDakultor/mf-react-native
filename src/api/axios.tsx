import Axios, { AxiosError } from "axios";

const IP: string = "http://192.168.1.93:3000";

// Payload interfaces
export interface RegistrationPayload {
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  birthdate: string;
  contactNumber: string;
  referredBy: string;
  password: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  // add other fields if returned
}

export interface VerifyCodeResponse {
  // define according to API, e.g., success flag
  success: boolean;
}

export interface EmailVerifyResponse {
  // define according to API, e.g., message or status
  message: string;
}

/**
 * Sends a verification code to the specified email.
 */
export const emailVerify = async (
  email: string
): Promise<EmailVerifyResponse> => {
  try {
    const res = await Axios.post<EmailVerifyResponse>(
      `${IP}/auth/send-verification`,
      { email }
    );
    return res.data;
  } catch (error: unknown) {
    console.error("Email verification error raw:", error);
    const err = error as AxiosError<{ error: string }>;
    const backendError = err.response?.data.error;
    throw new Error(backendError ?? "Email verification failed. Please try again.");
  }
};

/**
 * Verifies the code sent to the email.
 */
export const getCode = async (
  email: string,
  code: string
): Promise<VerifyCodeResponse> => {
  try {
    const res = await Axios.post<VerifyCodeResponse>(
      `${IP}/auth/verify-code`,
      { email, code }
    );
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message: string }>;
    const msg = err.response?.data.message ?? err.message;
    throw new Error(msg);
  }
};

/**
 * Completes user registration with provided user data.
 */
export const completeRegistration = async (
  userData: RegistrationPayload
): Promise<any> => {
  try {
    const res = await Axios.post(`${IP}/auth/complete-registration`, userData);
    return res.data;
  } catch (error: unknown) {
    console.error("Registration Error Raw:", error);
    const err = error as AxiosError<{ error: string }>;
    const backendError = err.response?.data.error;
    throw new Error(backendError ?? "Something went wrong");
  }
};

/**
 * Logs in a user and returns an authentication token.
 */
export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const res = await Axios.post<LoginResponse>(
      `${IP}/auth/login`,
      { username, password }
    );
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ error: string }>;
    const msg = err.response?.data.error ?? err.message;
    throw new Error(msg);
  }
};

export const resendCode = async (email: string): Promise<any> => {
  try {
    const res = await Axios.post(`${IP}/auth/resend-code`, { email });
    return res.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ error: string }>;
    const msg = err.response?.data.error ?? err.message;
    throw new Error(msg);
  }
};
