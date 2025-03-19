'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { Select } from '@/components/atoms';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  param?: string;
  shouldResetPageOnChange?: boolean;
  children?: React.ReactNode;
}

export const ParamSelect: React.FC<Props> = ({
  param = 'query',
  shouldResetPageOnChange = true,
  children,
  disabled,
  ...props
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(searchParams);
  const currentParam = params.get(param);
  const [pendingParam, setPendingParam] = React.useState(currentParam);

  function handleChange(term: string) {
    shouldResetPageOnChange && params.set('page', '1');
    if (term) {
      params.set(param, term);
    } else {
      params.delete(param);
    }
    setPendingParam(params.get(param));
    replace(`${pathname}?${params.toString()}`);
  }

  React.useEffect(() => {
    setPendingParam(currentParam);
  }, [currentParam]);

  return (
    <Select
      disabled={
        disabled || (currentParam !== pendingParam && currentParam !== null)
      }
      onChange={(e) => handleChange(e.target.value)}
      defaultValue={currentParam ?? ''}
      {...props}
    >
      {children}
    </Select>
  );
};
