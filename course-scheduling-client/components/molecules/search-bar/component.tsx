'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Spinner, TextInput } from '@/components/atoms';
import { cn } from '@/utils/cn';
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';

interface Props extends React.HTMLProps<HTMLSpanElement> {
  name?: string;
  param?: string;
  scrollTarget?: string;
  shouldResetPageOnChange?: boolean;
}

export const SearchBar: React.FC<Props> = ({
  name = 'query',
  param = 'query',
  scrollTarget,
  shouldResetPageOnChange = true,
  className,
  ...props
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const debouncedReplace = useDebouncedCallback(replace, 500);

  const params = new URLSearchParams(searchParams);
  const currentParam = params.get(param);
  const [pendingParam, setPendingParam] = React.useState(currentParam);

  function handleSearch(term: string) {
    shouldResetPageOnChange && params.set('page', '1');
    if (term) {
      params.set(param, term);
    } else {
      params.delete(param);
    }
    setPendingParam(params.get(param));
    debouncedReplace(`${pathname}?${params.toString()}#${scrollTarget || ''}`);
  }

  React.useEffect(() => {
    setPendingParam(currentParam);
  }, [currentParam]);

  return (
    <span className={cn('relative', className)} {...props}>
      <TextInput
        name={name}
        type="search"
        placeholder="Search"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={currentParam ?? ''}
        className="w-full pl-xxl"
      />
      {currentParam !== pendingParam && currentParam !== null ? (
        <Spinner className="absolute left-3 top-0 flex h-full items-center" />
      ) : (
        <MagnifyingGlassIcon
          width={20}
          height={20}
          className="absolute left-3 top-0 flex h-full items-center"
        />
      )}
    </span>
  );
};
