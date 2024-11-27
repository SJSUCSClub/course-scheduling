import { LastNameDisplay } from '@/app/(main)/professors/(page)/@name/lastname';
import { titlingGothicFB } from '@/app/fonts';
import { ProfessorsSearchResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import SWRConfigProvider from '@/wrappers/swr-config';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Professors',
};

export default async function Page() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const components: JSX.Element[] = [];
  const initialResults = await Promise.all(
    letters.map(async (letter) => {
      return (await fetcher(
        process.env.BASE_API_URL +
          `/core/professors/search?startswith=${letter}&limit=9`,
      )) as ProfessorsSearchResponse;
    }),
  );

  letters.forEach((letter, index) => {
    components.push(
      <LastNameDisplay
        startswith={letter}
        key={letter}
        initialResults={initialResults[index]}
      />,
    );
  });
  return (
    <>
      <h1
        className={`pb-md pt-xl ${titlingGothicFB.className} max-lg:text-[1.5rem] lg:text-[2rem]`}
      >
        Professors
      </h1>
      <div className="flex flex-col">
        <SWRConfigProvider>
          <div className="flex flex-col gap-[20px]">{components}</div>
        </SWRConfigProvider>
      </div>
    </>
  );
}
