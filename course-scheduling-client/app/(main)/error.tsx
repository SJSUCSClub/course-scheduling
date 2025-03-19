'use client';

import { Btn } from '@/components/atoms';
import React from 'react';
import ErrorImage from '@/assets/error.png';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <section className="mx-auto flex w-full max-w-content-width items-stretch px-md">
        <div className="flex w-full items-center justify-between gap-xxl py-xxl max-lg:flex-col">
          <div>
            <h1 className="pb-sm max-lg:text-h3-mobile lg:text-h3-desktop">
              There&apos;s been an error ;(
            </h1>
            <p className="pb-md">
              Someone&apos;s sleeping on the job 😒. We&apos;ll get this fixed
              as soon as possible.
            </p>
            <Btn variant="primary" onClick={reset}>
              Please try again
            </Btn>
          </div>
          <Image src={ErrorImage} alt="Error" width={400} height={400} />
        </div>
      </section>
    </main>
  );
}
