// export type RootStackParamList = {
//     Login: undefined;
//     EmailVerification: undefined;
//     Main: undefined;
//     CodeVerification: { email: string };
//     CompleteRegistration: { email: string };
//     // …any other screens
//   };
// types/auth.ts
export type RootStackParamList = {
  Login: undefined;
  EmailVerification: undefined;
  CodeVerification: undefined;
  CompleteRegistration: undefined;
  Main: undefined;
};

export type SignInParams = {
  username: string;
  password: string;
};

export type AuthState = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
  userId: string | null;
};

export type AuthAction =
  | { type: "RESTORE_TOKEN"; token: string | null; userId: string | null }
  | { type: "SIGN_IN"; token: string; userId: string }
  | { type: "SIGN_OUT" };