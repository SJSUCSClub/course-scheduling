'use client';
import { CheckWithoutProviders } from '@/app/(main)/admin/check';
import { Manage } from '@/app/(main)/admin/manage/manage';
import SWRConfigProvider from '@/wrappers/swr-config';

export default function Admins() {
  return (
    <main>
      {/* Add Mod section */}
      <SWRConfigProvider>
        <CheckWithoutProviders justAdministrators>
          <Manage />
        </CheckWithoutProviders>
      </SWRConfigProvider>
    </main>
  );
}
