import Image from 'next/image';
import ACMCSLogo from '@/assets/acm-cs-logo.svg';
import { ColorModePicker } from '@/components/molecules';
import { LinkBtn } from '@/components/atoms';

export const Footer: React.FC = () => {
  return (
    <footer className="mx-auto flex w-full max-w-content-width items-center justify-between gap-md px-xxl text-neutral max-lg:flex-col max-lg:py-xl lg:py-lg">
      <label className="flex flex-col gap-xs max-lg:items-center">
        <span className="text-small-lg">Theme</span>
        <ColorModePicker />
      </label>
      <div className="flex flex-col items-center">
        <p className="pb-sm text-center">
          Brought to you by ACM-CS@SJSU © 2024. All Rights Reserved.
        </p>
        <LinkBtn
          variant="tertiary"
          className="hover-underline rounded-sm p-0 pb-xs font-normal text-inherit"
          href="/privacy"
        >
          Privacy Policy
        </LinkBtn>
        <LinkBtn
          variant="tertiary"
          className="hover-underline rounded-sm p-0 font-normal text-inherit"
          href="/terms"
        >
          Terms of Service
        </LinkBtn>
      </div>
      <LinkBtn
        href="https://acmsjsu.org"
        target="_blank"
        variant="tertiary"
        className="rounded-sm p-0"
      >
        <Image
          src={ACMCSLogo}
          className="dark:brightness-[10]"
          alt="acm-cs-logo"
        />
      </LinkBtn>
    </footer>
  );
};
