'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import React from 'react';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/utils/cn';

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  if (currentPage <= 3) return [1, 2, 3, '...', totalPages - 1, totalPages];

  if (currentPage >= totalPages - 2)
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'middle' | 'single';
  isActive: boolean;
}) {
  const className = cn(
    'flex max-lg:h-8 max-lg:min-w-8 w-fit px-1 lg:h-10 lg:min-w-10 items-center justify-center max-lg:text-small-sm border-border border-2 transition-all duration-100 ease-in-out',
    {
      'rounded-l-sm': position === 'first' || position === 'single',
      'rounded-r-sm': position === 'last' || position === 'single',
      'z-10 bg-primary text-background': isActive,
      'hover:bg-border': !isActive && position !== 'middle',
      'text-neutral': position === 'middle',
    },
  );

  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  );
}

const PaginationArrow = ({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) => {
  const className = cn(
    'flex max-lg:h-8 max-lg:w-8 lg:h-10 lg:w-10 items-center justify-center rounded-sm transition-all duration-100 ease-in-out',
    {
      'pointer-events-none text-neutral': isDisabled,
      'hover:bg-border': !isDisabled,
      'max-lg:mr-2 lg:mr-4': direction === 'left',
      'max-lg:ml-2 lg:ml-4': direction === 'right',
    },
  );

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className="max-lg:w-3 lg:w-4" />
    ) : (
      <ArrowRightIcon className="max-lg:w-3 lg:w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
};

export const PaginationBar = ({ totalPages }: { totalPages: number }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <>
      <div className="inline-flex">
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className="flex -space-x-px">
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined;

            if (index === 0) position = 'first';
            if (index === allPages.length - 1) position = 'last';
            if (allPages.length === 1) position = 'single';
            if (page === '...') position = 'middle';

            return (
              <PaginationNumber
                key={page}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
};
