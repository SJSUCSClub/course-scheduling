import { Btn, LinkBtn } from '@/components/atoms';
import { FilterGroup, PaginationBar } from '@/components/molecules';
import { Schedule } from '@/components/organisms';
import { SchedulesSearchResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schedules Search',
};

export default async function Page({
  searchParams,
}: {
  searchParams: {
    query: string;
    limit: string;
    page: string;
    term: string;
    year: string;
    professor_name: string;
    course_number: string;
    department: string;
    mode_of_instruction: string;
    units: string;
  };
}) {
  const requestParams = new URLSearchParams();
  searchParams.query && requestParams.append('query', searchParams.query);
  requestParams.append('limit', searchParams.limit ?? '10');
  requestParams.append('page', searchParams.page ?? '1');
  searchParams.term && requestParams.append('term', searchParams.term);
  searchParams.year && requestParams.append('year', searchParams.year);
  searchParams.professor_name &&
    requestParams.append('professor_name', searchParams.professor_name);
  searchParams.course_number &&
    requestParams.append('course_number', searchParams.course_number);
  searchParams.department &&
    requestParams.append('department', searchParams.department);
  searchParams.mode_of_instruction &&
    requestParams.append(
      'mode_of_instruction',
      searchParams.mode_of_instruction,
    );
  searchParams.units && requestParams.append('units', searchParams.units);
  const { total_results, pages, filters, items } = (await fetcher(
    process.env.BASE_API_URL +
      `/core/schedules/search?${requestParams.toString()}`,
  )) as SchedulesSearchResponse;

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
              {filters.term?.length ? (
                <>
                  {' '}
                  <p className="pb-sm text-small-lg">Term</p>
                  <FilterGroup
                    variant="radio"
                    param="term"
                    values={filters.term?.flatMap((t) => t.term) ?? []}
                    className="pb-lg"
                  />
                </>
              ) : null}
              {filters.year?.length ? (
                <>
                  <p className="pb-sm text-small-lg">Year</p>
                  <FilterGroup
                    variant="radio"
                    param="year"
                    values={
                      filters.year?.flatMap((y) => y.year.toString()) ?? []
                    }
                    className="pb-lg"
                  />
                </>
              ) : null}
              {filters.professor_name?.length ? (
                <>
                  <p className="pb-sm text-small-lg">Professor</p>
                  <FilterGroup
                    variant="radio"
                    param="professor_name"
                    values={
                      filters.professor_name
                        ?.filter((p) => p.professor_name !== null)
                        .flatMap((p) => p.professor_name) ?? []
                    }
                    className="pb-lg"
                  />
                </>
              ) : null}
              {filters.course_number?.length ? (
                <>
                  <p className="pb-sm text-small-lg">Course Number</p>
                  <FilterGroup
                    variant="radio"
                    param="course_number"
                    values={
                      filters.course_number?.flatMap((c) => c.course_number) ??
                      []
                    }
                    className="pb-lg"
                  />
                </>
              ) : null}
              {filters.department?.length ? (
                <>
                  <p className="pb-sm text-small-lg">Department</p>
                  <FilterGroup
                    variant="radio"
                    param="department"
                    values={
                      filters.department?.flatMap((d) => d.department) ?? []
                    }
                    className="pb-lg"
                  />
                </>
              ) : null}
              {filters.mode_of_instruction?.length ? (
                <>
                  <p className="pb-sm text-small-lg">Mode of Instruction</p>
                  <FilterGroup
                    variant="radio"
                    param="mode_of_instruction"
                    values={
                      filters.mode_of_instruction?.flatMap(
                        (m) => m.mode_of_instruction,
                      ) ?? []
                    }
                    className="pb-lg"
                  />
                </>
              ) : null}
              {filters.units?.length ? (
                <>
                  <p className="pb-sm text-small-lg">Units</p>
                  <FilterGroup
                    variant="checkbox"
                    param="units"
                    values={
                      filters.units?.flatMap((u) => u.units.toString()) ?? []
                    }
                    className="pb-lg"
                  />
                </>
              ) : null}

              <LinkBtn
                variant="primary"
                className="flex justify-center bg-background text-primary"
                href={`/schedules/search?query=${searchParams.query ?? ''}`}
              >
                Reset
              </LinkBtn>
            </div>
          </div>
        ) : null}
        <div className="flex flex-1 flex-col items-stretch gap-md pb-lg pt-lg">
          <div className="flex">
            <p className="flex-1">{total_results ?? '-'} Schedule(s)</p>
            <Btn
              popoverTarget="filters"
              variant="tertiary"
              className="rounded-sm p-0 lg:hidden"
            >
              <EllipsisVerticalIcon width={24} height={24} />
            </Btn>
          </div>

          {items && total_results > 0
            ? items.map((schedule, i) => (
                <Schedule
                  key={i}
                  link={`/professors/${schedule.professor_id}`}
                  subtitle={`${schedule.department} ${schedule.course_number} - ${schedule.section}`}
                  title={schedule.professor_name ?? 'TBA'}
                  details={[
                    `${schedule.term} ${schedule.year}`,
                    schedule.satisfies_area
                      ? `Satisfies ${schedule.satisfies_area}`
                      : '',
                    `${schedule.units ?? '-'} Units`,
                    schedule.class_type,
                  ]}
                  dates={schedule.dates}
                  times={schedule.times}
                  location={schedule.location ?? '-'}
                  modeOfInstruction={schedule.mode_of_instruction}
                  days={schedule.days}
                />
              ))
            : null}
          <div className="flex w-full justify-center">
            <PaginationBar totalPages={pages} />
          </div>
        </div>
      </section>
    </main>
  );
}
