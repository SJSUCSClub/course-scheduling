'use client';

import { LinkBtn } from '@/components/atoms';
import { cn } from '@/utils/cn';
import { useSession } from '@/wrappers/session-provider';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface Props
  extends Omit<
    React.ComponentProps<typeof LinkBtn>,
    'variant' | 'children' | 'href'
  > {}

export const ProfileBtn: React.FC<Props> = ({ className, ...props }) => {
  const session = useSession();
  if (session) {
    return (
      <LinkBtn
        className={cn('!text-neutral', className)}
        {...props}
        href="/profile"
        variant="tertiary"
        aria-label="Profile"
      >
        <UserCircleIcon width={24} height={24} />{' '}
      </LinkBtn>
    );
  }
  return null;
};
