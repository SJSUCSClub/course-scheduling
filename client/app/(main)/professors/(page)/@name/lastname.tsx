'use client';

import { Btn, Card } from '@/components/atoms';
import { ProfessorsSearchResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import Link from 'next/link';
import React from 'react';
import useSWRInfinite from 'swr/infinite';
const getKey =
  (startswith: string) =>
  (pageIndex: number, previousPageData: ProfessorsSearchResponse) => {
    if (previousPageData && previousPageData.page === previousPageData.pages)
      return null;
    return `/django/core/professors/search?startswith=${startswith}&page=${pageIndex + 1}&limit=9`;
  };

interface LastNameDisplayProps {
  startswith: string;
  initialResults: ProfessorsSearchResponse;
}
export const LastNameDisplay: React.FC<LastNameDisplayProps> = ({
  startswith,
  initialResults,
}) => {
  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<ProfessorsSearchResponse>(getKey(startswith), fetcher, {
      revalidateOnFocus: false,
    });
  if (error) {
    throw error;
  }

  // If no results, don't render
  if (initialResults.total_results === 0) {
    return <></>;
  }

  // otherwise, render
  const pages = initialResults.pages;
  const items = data?.flatMap((d) => d.items) ?? initialResults.items;
  return (
    <Card className="flex flex-col gap-[20px] p-[20px]">
      <div className="flex flex-col items-center">
        <span className="text-h3-mobile lg:text-h3-desktop">{startswith}</span>
        <span className="text-text">
          {initialResults.total_results} Professors
        </span>
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-[20px]">
        {items.map((professor) => (
          <Card className="items-center" key={professor.id}>
            <Link
              href={`/professors/${professor.id}`}
              className="flex h-full w-[300px] flex-row items-center justify-between px-md py-md animation hover:bg-[rgb(var(--color-secondary)/0.15)] focus:bg-[rgb(var(--color-secondary)/0.15)]"
            >
              <div className="flex w-full flex-col text-center">
                <span className="w-full text-p font-bold">
                  {professor.name}
                </span>
                <span className="w-full text-small-lg text-neutral">
                  {professor.email}
                </span>
              </div>
            </Link>
          </Card>
        ))}
      </div>
      {size !== pages || isLoading || isValidating ? (
        <div className="flex justify-center">
          <Btn
            className="justify-end"
            variant="primary"
            onClick={() => setSize(size + 1)}
          >
            Load more
          </Btn>
        </div>
      ) : null}
    </Card>
  );
};
