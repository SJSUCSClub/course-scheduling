'use client';

import { SessionType } from '@/types';
import React from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';

type SessionContext = SessionType;

// initialize to undefined since null is a possible value and undefined
// will only happen if there is no above context
const SessionContext = React.createContext<SessionContext>(undefined);

interface SessionProviderProps {
  children: React.ReactNode;
}

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => (
  <CookiesProvider>
    <SessionProviderWithoutCookies>{children}</SessionProviderWithoutCookies>
  </CookiesProvider>
);

const SessionProviderWithoutCookies: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);
  const [cookies] = useCookies(['user_data']);
  const data =
    cookies.user_data && isClient
      ? JSON.parse(cookies.user_data.replace(/\\/g, '').replace(/054/g, ','))
      : null;
  return (
    <SessionContext.Provider value={data}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export default SessionProvider;
