'use client';

import NotFoundImage from '@/assets/not-found.png';
import { Btn } from '@/components/atoms';
import { Metadata } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const metadata: Metadata = {
  title: '404 Not Found',
};

export default function NotFound() {
  const router = useRouter();
  return (
    <main>
      <section className="mx-auto flex w-full max-w-content-width items-stretch px-md">
        <div className="flex w-full flex-col items-center gap-xxl py-xxl">
          <div className="flex flex-col items-center">
            <h1 className="pb-sm text-center max-lg:text-h1-mobile-lg lg:text-h1-desktop-lg">
              404.
            </h1>
            <p className="pb-lg text-center lg:text-h5-desktop">
              The page you are looking for does not exist.
            </p>
            <Btn variant="primary" onClick={() => router.back()}>
              Go back
            </Btn>
          </div>
          <Image
            unoptimized
            src={NotFoundImage}
            alt="NotFound"
            width={600}
            height={600}
          />
        </div>
      </section>
    </main>
  );
}
