'use client';
import { Check } from '@/app/(main)/admin/check';
import { Manage } from '@/app/(main)/admin/manage/manage';
import SWRConfigProvider from '@/wrappers/swr-config';

export default function Admins() {
  return (
    <main>
      {/* Add Mod section */}
      <SWRConfigProvider>
        <Check justAdministrators>
          <Manage />
        </Check>
      </SWRConfigProvider>
    </main>
  );
}
