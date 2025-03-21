'use client';

import ErrorImage from '@/assets/error.png';
import { LinkBtn } from '@/components/atoms';
import Image from 'next/image';
import { useCookies } from 'react-cookie';

export default function Page() {
  // get frontend_redirect_uri (set by the server)
  const [cookies] = useCookies(['frontend_redirect_uri']);

  return (
    <main>
      <section className="mx-auto flex w-full max-w-content-width items-stretch px-md">
        <div className="flex w-full items-center justify-between gap-xxl py-xxl max-lg:flex-col">
          <div>
            <h1 className="pb-sm max-lg:text-h3-mobile lg:text-h3-desktop">
              Login Failed
            </h1>
            <p className="pb-md">
              Unfortunately, only San Jose State University accounts can sign
              in. Please use your @sjsu.edu email address to sign in.
            </p>
            <LinkBtn
              href={cookies.frontend_redirect_uri || '/'}
              variant="primary"
            >
              Go back
            </LinkBtn>
          </div>
          <Image src={ErrorImage} alt="Error" width={400} height={400} />
        </div>
      </section>
    </main>
  );
}
