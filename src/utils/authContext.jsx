import React from 'react';

export const AuthContext = React.createContext({
    signIn: async (creds) => {},
    signOut: async () => {},
    userToken: null,
  });