'use client';

import Image from 'next/image';
import {
  Bars3Icon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import logo from '@/assets/logo.svg';
import Link from 'next/link';
import React from 'react';
import { Btn, LinkBtn } from '@/components/atoms';
import Footer from '../../footer';
import SessionWrapper from '@/wrappers/session-provider';
import { AuthBtn, NavSearchBar, ProfileBtn } from '@/components/molecules';
import { cn } from '@/utils/cn';

export const Navbar: React.FC = () => {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const [isShownSearch, setIsShownSearch] = React.useState(false);
  const toggleMenu = () => {
    setIsShownSearch(false);
    setIsOpenMenu(!isOpenMenu);
  };
  const toggleSearch = () => {
    !isOpenMenu && setIsShownSearch(!isShownSearch);
  };
  return (
    <div className="w-full bg-background">
      <header className="mx-auto flex w-full max-w-content-width items-center justify-between gap-xl bg-background max-lg:fixed max-lg:z-50 max-lg:min-h-[80px] max-lg:border-b-2 max-lg:border-border max-lg:px-md max-lg:py-md lg:px-lg lg:py-md">
        <Btn
          className="rounded-sm p-0 lg:hidden"
          variant="tertiary"
          onClick={toggleSearch}
          disabled={isOpenMenu}
        >
          {isShownSearch ? (
            <ChevronLeftIcon width={24} height={24} />
          ) : (
            <MagnifyingGlassIcon width={24} height={24} />
          )}
        </Btn>

        {/* Logo */}
        <Link
          className={cn({ 'max-lg:hidden': isShownSearch })}
          href="/"
          onClick={() => setIsOpenMenu(false)}
        >
          {/* Desktop Logo */}
          <Image src={logo} alt="logo" />
        </Link>

        {/* Search Bar */}
        <div className={cn('flex-1', { 'max-lg:hidden': !isShownSearch })}>
          <NavSearchBar />
        </div>

        {/* Mobile Menu Toggle */}
        <Btn
          className="rounded-sm p-0 lg:hidden"
          variant="tertiary"
          onClick={toggleMenu}
        >
          {isOpenMenu ? (
            <XMarkIcon width={24} height={24} />
          ) : (
            <Bars3Icon width={24} height={24} />
          )}
        </Btn>

        {/* Nav */}
        <ul
          className={cn(
            'flex items-center gap-lg max-lg:fixed max-lg:left-0 max-lg:top-[80px] max-lg:h-[calc(100vh-80px)] max-lg:w-full max-lg:flex-col max-lg:overflow-y-scroll max-lg:bg-background max-lg:p-lg max-lg:transition-all',
            {
              'max-lg:translate-x-0 max-lg:opacity-100': isOpenMenu,
              'max-lg:invisible max-lg:translate-x-xl max-lg:opacity-0':
                !isOpenMenu,
            },
          )}
        >
          <li>
            <nav className="flex gap-y-md max-lg:flex-col max-lg:items-center">
              <LinkBtn onClick={toggleMenu} href="/courses" variant="tertiary">
                Courses
              </LinkBtn>
              <LinkBtn
                onClick={toggleMenu}
                href="/professors"
                variant="tertiary"
              >
                Professors
              </LinkBtn>
              <LinkBtn onClick={toggleMenu} href="/compare" variant="tertiary">
                Compare
              </LinkBtn>
              <SessionWrapper>
                <ProfileBtn onClick={toggleMenu} />
              </SessionWrapper>
            </nav>
          </li>
          <li>
            <SessionWrapper>
              <AuthBtn />
            </SessionWrapper>
          </li>
          <li className="flex flex-1 flex-col justify-end lg:hidden">
            <Footer />
          </li>
        </ul>
      </header>
      <hr className="w-full border-b-2 border-border max-lg:hidden" />
      {/* Mobile Nav Spacer */}
      <div className="h-[80px] lg:hidden" />
    </div>
  );
};
