'use client';

import fetcher from '@/utils/fetcher';
import { SWRConfig } from 'swr';

interface SWRConfigProviderProps {
  children: React.ReactNode;
}

const SWRConfigProvider: React.FC<SWRConfigProviderProps> = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigProvider;
