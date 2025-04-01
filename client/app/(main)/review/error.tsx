'use client';

import React from 'react';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <section className="mx-auto flex w-full max-w-content-width items-stretch px-md">
        <div className="flex w-full flex-col items-center gap-xxl py-xxl">
          <div className="flex flex-col items-stretch">
            <h1 className="pb-sm text-center max-lg:text-h1-mobile-sm lg:text-h1-desktop-sm">
              Error
            </h1>
            <p className="pb-xxl text-center lg:text-h5-desktop">
              If you already submitted a review for this professor-course
              combination, you cannot submit a new review. Otherwise, please try
              again later.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
