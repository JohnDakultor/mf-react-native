export type RootStackParamList = {
    Login: undefined;
    EmailVerification: undefined;
    Main: undefined;
    CodeVerification: { email: string };
    CompleteRegistration: { email: string };
    // …any other screens
  };
  