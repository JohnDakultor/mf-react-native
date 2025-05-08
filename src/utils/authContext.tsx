// import React from 'react';

// type Credentials = {
//   username: string;
//   password: string;
// };

// export const AuthContext = React.createContext({
//     signIn: async (creds: Credentials) => {},
//     signOut: async () => {},
//     userToken: null,
//     userId: null as string | null,
//   });

import { createContext } from 'react';

type AuthContextType = {
  signIn: ({ username, password }: { username: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  userToken: string | null;
  userId: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: async () => {},
  userToken: null,
  userId: null,
});