import React from 'react';

type Credentials = {
  username: string;
  password: string;
};

export const AuthContext = React.createContext({
    signIn: async (creds: Credentials) => {},
    signOut: async () => {},
    userToken: null,
  });