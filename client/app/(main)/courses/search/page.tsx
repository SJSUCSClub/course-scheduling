import { Btn, Card, LinkBtn } from '@/components/atoms';
import { FilterGroup, PaginationBar } from '@/components/molecules';
import { CoursesSearchResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Courses Search',
};

export default async function Page({
  searchParams,
}: {
  searchParams: {
    query: string;
    limit: string;
    page: string;
    department: string;
    units: string;
    satisfies_area: string;
  };
}) {
  const requestParams = new URLSearchParams();
  searchParams.query && requestParams.append('query', searchParams.query);
  searchParams.department &&
    requestParams.append('department', searchParams.department);
  searchParams.units && requestParams.append('units', searchParams.units);
  searchParams.satisfies_area &&
    requestParams.append('satisfies_area', searchParams.satisfies_area);
  requestParams.append('limit', searchParams.limit ?? '10');
  requestParams.append('page', searchParams.page ?? '1');
  const { total_results, pages, filters, items } = (await fetcher(
    process.env.BASE_API_URL +
      `/core/courses/search?${requestParams.toString()}`,
  )) as CoursesSearchResponse;

  return (
    <main>
      <div className="mx-auto w-full max-w-content-width px-md py-lg">
        <p>Search results for &quot;{searchParams.query}&quot;</p>
      </div>
      <section className="mx-auto flex w-full max-w-content-width items-stretch px-md">
        {total_results ? (
          <div className="lg:w-[250px] lg:pr-md">
            <div
              id="filters"
              popover="auto"
              className="top-0 max-h-[100dvh] min-h-[50dvh] w-full overflow-y-auto bg-page pb-lg pt-lg max-lg:h-[100dvh] max-lg:px-md lg:sticky lg:flex lg:flex-col lg:gap-sm"
            >
              <div className="flex">
                <p className="flex-1 pb-md">Filters</p>
                <Btn
                  popoverTarget="filters"
                  variant="tertiary"
                  className="rounded-sm p-0 lg:hidden"
                >
                  <XMarkIcon width={24} height={24} />
                </Btn>
              </div>
              <p className="pb-sm text-small-lg">Limit</p>
              <FilterGroup
                variant="radio"
                param="limit"
                values={['3', '10', '20', '50']}
                className="pb-lg"
              />
              {filters.departments.length ? (
                <>
                  <p className="pb-sm text-small-lg">Department</p>
                  <FilterGroup
                    variant="radio"
                    param="department"
                    values={filters.departments.flatMap((d) => d.department)}
                    className="pb-lg"
                  />{' '}
                </>
              ) : null}
              {filters.units.length ? (
                <>
                  <p className="pb-sm text-small-lg">Units</p>
                  <FilterGroup
                    variant="radio"
                    param="units"
                    values={filters.units.flatMap((u) => u.units)}
                    className="pb-lg"
                  />
                </>
              ) : null}

              {/* TODO: Uncomment when satisfies_area is added to the response */}
              {/*
            {filters.satisfies_areas.length ? ( <>
              <p className="pb-sm text-small-lg">Satisfies Area</p>
              <FilterGroup
                variant="radio"
                param="satisfies_area"
                values={filters.satisfies_areas.flatMap((s) => s.satisfies_area)}
                className="pb-lg"
              />
            </> ) : null}
            */}

              <LinkBtn
                variant="primary"
                className="flex justify-center bg-background text-primary"
                href={`/courses/search?query=${searchParams.query ?? ''}`}
              >
                Reset
              </LinkBtn>
            </div>
          </div>
        ) : null}
        <div className="flex flex-1 flex-col items-stretch gap-md pb-lg pt-lg">
          <div className="flex">
            <p className="flex-1">{total_results ?? '-'} Course(s)</p>
            <Btn
              popoverTarget="filters"
              variant="tertiary"
              className="rounded-sm p-0 lg:hidden"
            >
              <EllipsisVerticalIcon width={24} height={24} />
            </Btn>
          </div>

          {items && total_results > 0 ? (
            <Card>
              <menu>
                {items.map((course, i) => (
                  <li
                    key={i}
                    className="border-b-2 border-border last:border-b-0"
                  >
                    <Link
                      href={`/courses/${course.department}-${course.course_number}`}
                      className="flex flex-col px-lg py-md animation hover:bg-[rgb(var(--color-primary)/0.15)] focus:bg-[rgb(var(--color-primary)/0.15)]"
                    >
                      <span className="overflow-ellipsis text-small-lg text-neutral">
                        {course.department} {course.course_number}
                      </span>
                      <span className="overflow-ellipsis text-p font-bold">
                        {course.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </menu>
            </Card>
          ) : null}
          <div className="flex w-full justify-center">
            <PaginationBar totalPages={pages} />
          </div>
        </div>
      </section>
    </main>
  );
}
