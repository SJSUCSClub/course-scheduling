'use client';
import { Check } from '@/app/(main)/admin/check';
import { Dashboard } from '@/app/(main)/admin/dashboard';
import SWRConfigProvider from '@/wrappers/swr-config';

export default function Page() {
  return (
    <main>
      <SWRConfigProvider>
        <Check>
          <Dashboard />
        </Check>
      </SWRConfigProvider>
    </main>
  );
}
