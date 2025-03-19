import { BreadcrumbMenu } from '@/components/atoms';
import { formatName } from '@/utils/format-name';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: `${formatName(params.id)}`,
  };
}

export default function Layout({
  statistics,
  schedules,
  reviews,
  params,
}: {
  statistics: React.ReactNode;
  schedules: React.ReactNode;
  reviews: React.ReactNode;
  params: { id: string };
}) {
  return (
    <main>
      <BreadcrumbMenu className="mx-auto w-full max-w-content-width px-md py-lg">
        <li>
          <Link href="/professors">Professors</Link>
        </li>
        <li>{params.id}</li>
      </BreadcrumbMenu>
      {statistics}
      {schedules}
      {reviews}
    </main>
  );
}
