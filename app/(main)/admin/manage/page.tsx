'use client';
import { Manage } from '@/app/(main)/admin/manage/manage';
import { BreadcrumbMenu } from '@/components/atoms';
import SWRConfigProvider from '@/wrappers/swr-config';
import Link from 'next/link';

export default function Admins() {
  return (
    <main>
      <BreadcrumbMenu className="mx-auto w-full max-w-content-width px-md py-lg">
        <li>
          <Link href="/admin">Admin</Link>
        </li>
        <li>Manage</li>
      </BreadcrumbMenu>

      {/* Add Mod section */}
      <SWRConfigProvider>
        <Manage />
      </SWRConfigProvider>
    </main>
  );
}
