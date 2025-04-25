import logo from '@/assets/logo.svg';
import { Card, LinkBtn } from '@/components/atoms';
import { NavSearchBar } from '@/components/molecules';
import Image from 'next/image';
import SplineNext from '@splinetool/react-spline/next';
import {
  IdentificationIcon,
  MagnifyingGlassIcon,
  Square2StackIcon,
  CalendarIcon,
} from '@heroicons/react/24/solid';
import { titlingGothicFB } from '../fonts';
import { Navbar } from '@/components/organisms';

export default function Page() {
  return (
    <main className="relative">
      <Navbar landing />
      <section className="mx-auto w-full max-w-content-width px-md py-xxl">
        <div className="flex items-center justify-center gap-[3rem] overflow-visible max-lg:flex-col max-lg:px-xl max-lg:pb-xl max-lg:pt-md lg:px-[56px] lg:py-[56px]">
          <div className="flex flex-col gap-lg max-lg:items-center">
            <div className="flex flex-col gap-sm max-lg:items-center">
              <Image src={logo} alt="logo" width={60} height={60} />
              <h3 className="font-bold text-neutral">ACM-CS@SJSU</h3>
              <h1
                className={`${titlingGothicFB.className} pb-xs text-[3.25rem] leading-[3.25rem]`}
              >
                Lenses™
              </h1>

              <h2 className="text-neutral max-lg:text-center max-lg:text-h6-mobile lg:text-h6-desktop">
                Browse classes with peace of mind
              </h2>
            </div>
            <NavSearchBar />
          </div>
          <SplineNext
            style={{
              width: '350px',
              objectFit: 'cover',
              height: '300px',
              marginLeft: '4rem',
            }}
            scene="https://prod.spline.design/zxtbNi7bvatFum9j/scene.splinecode"
          />
        </div>
        <div className="flex flex-wrap gap-md pb-[3.5rem] pt-md max-lg:flex-col">
          <LinkBtn
            variant="tertiary"
            className="flex-1 p-0 text-inherit"
            href="/courses"
            aria-label="Browse Courses"
          >
            <Card className="h-full w-full p-xl">
              <div className="text-secondary">
                <MagnifyingGlassIcon width={24} height={24} />
                <h3 className="pb-sm pt-md !font-semibold lg:text-h6-desktop">
                  Browse Courses
                </h3>
              </div>
              <p className="text-p text-neutral">
                Browse our catalog of 10,000+ courses and apply filters.
              </p>
            </Card>
          </LinkBtn>
          <LinkBtn
            variant="tertiary"
            className="flex-1 p-0 text-inherit"
            href="/professors"
            aria-label="Review Professors"
          >
            <Card className="h-full w-full p-xl">
              <div className="text-primary">
                <IdentificationIcon width={24} height={24} />
                <h3 className="pb-sm pt-md !font-semibold lg:text-h6-desktop">
                  Review Professors
                </h3>
              </div>
              <p className="text-p text-neutral">
                View user submitted reviews based on SJSU professors.{' '}
              </p>
            </Card>
          </LinkBtn>
          <LinkBtn
            variant="tertiary"
            className="flex-1 p-0 text-inherit"
            href="/schedules/search"
            aria-label="View Schedules"
          >
            <Card className="h-full w-full p-xl">
              <div className="text-accent">
                <CalendarIcon width={24} height={24} />
                <h3 className="pb-sm pt-md !font-semibold lg:text-h6-desktop">
                  View Schedules
                </h3>
              </div>
              <p className="text-p text-neutral">
                View all SJSU schedules for this semester.{' '}
              </p>
            </Card>
          </LinkBtn>
          <LinkBtn
            variant="tertiary"
            className="flex-1 p-0 text-inherit"
            href="/compare"
            aria-label="Compare"
          >
            <Card className="h-full w-full p-xl">
              <div className="text-good">
                <Square2StackIcon width={24} height={24} />
                <h3 className="pb-sm pt-md !font-semibold lg:text-h6-desktop">
                  Compare
                </h3>
              </div>
              <p className="text-p text-neutral">
                View rating or grade distributions side by side.
              </p>
            </Card>
          </LinkBtn>
        </div>
      </section>
    </main>
  );
}
