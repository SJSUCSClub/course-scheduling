'use client';

import { LinkBtn } from '@/components/atoms';
import googleIcon from '@/assets/google-icon.svg';
import Image from 'next/image';
import { useSession } from '@/wrappers/session-provider';
import React from 'react';

interface Props
  extends Omit<
    React.ComponentProps<typeof LinkBtn>,
    'variant' | 'children' | 'href'
  > {}

export const AuthBtn: React.FC<Props> = ({ ...props }) => {
  const session = useSession();
  if (session) {
    return (
      <LinkBtn
        prefetch={false}
        {...props}
        href="/django/google/logout"
        variant="ghost"
      >
        Sign out
      </LinkBtn>
    );
  }
  return (
    <LinkBtn
      {...props}
      prefetch={false}
      href="/django/google/authorize"
      className="!gap-sm bg-background text-text"
      variant="primary"
    >
      <Image src={googleIcon} alt="google-icon" />
      Sign in
    </LinkBtn>
  );
};
