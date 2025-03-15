'use client';
import { CheckWithoutProviders } from '@/app/(main)/admin/check';
import { DashboardWithoutProviders } from '@/app/(main)/admin/dashboard';
import SWRConfigProvider from '@/wrappers/swr-config';

export default function Page({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  return (
    <main>
      <SWRConfigProvider>
        <CheckWithoutProviders>
          <DashboardWithoutProviders page={searchParams.page ?? '1'} />
        </CheckWithoutProviders>
      </SWRConfigProvider>
    </main>
  );
}
