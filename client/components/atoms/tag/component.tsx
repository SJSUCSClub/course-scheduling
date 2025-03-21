'use client';

import { cn } from '@/utils/cn';
import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
}

export const Tag: React.FC<Props> = ({ children, className, ...props }) => {
  const [id, setId] = React.useState('');
  React.useEffect(() => setId(Math.random().toString(36).substring(7)), []);
  return (
    <span>
      <input {...props} className="peer sr-only" id={id} />
      <label
        className={cn(
          'flex cursor-pointer items-center gap-xs rounded-lg bg-border px-md py-sm animation peer-checked:!bg-primary peer-checked:!text-background peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary peer-focus:ring-offset-2 peer-enabled:hover:opacity-50 peer-enabled:active:opacity-25 peer-disabled:text-neutral',
          className,
        )}
        htmlFor={id}
      >
        {children}
      </label>
    </span>
  );
};
