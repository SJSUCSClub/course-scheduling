import { AdminEnum, AdminVerifyResponse } from '@/types/admin';
import React, { createContext, PropsWithChildren } from 'react';
import useSWR from 'swr';

interface CheckProps extends PropsWithChildren {
  justAdministrators?: boolean;
}

export const RoleContext = createContext<AdminEnum | undefined>(undefined);

export const CheckWithoutProviders: React.FC<CheckProps> = ({
  children,
  justAdministrators,
}) => {
  const { data, isLoading } = useSWR<AdminVerifyResponse>(
    '/api/admin/verify',
  );

  return isLoading ? (
    <section className="mx-auto w-full max-w-content-width px-md pb-lg pt-xxl">
      <div>
        <h1 className="pb-xs max-lg:text-h3-mobile lg:text-h3-desktop">
          Verifying...
        </h1>
      </div>
    </section>
  ) : data &&
    data.isAdmin &&
    data.role &&
    (!justAdministrators || data.role == 'Administrator') ? (
    <RoleContext.Provider value={data.role}>{children}</RoleContext.Provider>
  ) : (
    <section className="mx-auto w-full max-w-content-width px-md pb-lg pt-xxl">
      <div>
        <h1 className="pb-xs max-lg:text-h3-mobile lg:text-h3-desktop">
          Unauthorized
        </h1>
        <p className="text-text">
          Only
          {justAdministrators
            ? ' Administrators '
            : ' Administrators and Moderators '}
          can access this page. You do not have sufficient permissions to access
          this page.
        </p>
      </div>
    </section>
  );
};
