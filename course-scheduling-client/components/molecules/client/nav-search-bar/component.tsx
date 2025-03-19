'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

import { Card } from '@/components/atoms';
import { ParamSelect, SearchBar } from '@/components/molecules';
import {
  CoursesSearchResponse,
  ProfessorsSearchResponse,
  SchedulesSearchResponse,
} from '@/types';
import SWRConfigProvider from '@/wrappers/swr-config';
import Link from 'next/link';

type Error = { message: string };

const useCoursesSearchResults = (currentQuery: string) => {
  const apiQueryParams = new URLSearchParams();
  apiQueryParams.set('query', currentQuery);
  apiQueryParams.set('limit', '3');
  const { data, error, isLoading } = useSWR<CoursesSearchResponse, Error>(
    `/django/core/courses/search?${apiQueryParams.toString()}`,
  );
  return { data, error, isLoading };
};

const useProfessorsSearchResults = (currentQuery: string) => {
  const apiQueryParams = new URLSearchParams();
  apiQueryParams.set('query', currentQuery);
  apiQueryParams.set('limit', '3');

  const { data, error, isLoading } = useSWR<ProfessorsSearchResponse, Error>(
    `/django/core/professors/search?${apiQueryParams.toString()}`,
  );
  return { data, error, isLoading };
};

const useSchedulesSearchResults = (currentQuery: string) => {
  const apiQueryParams = new URLSearchParams();
  apiQueryParams.set('query', currentQuery);
  apiQueryParams.set('limit', '3');
  const { data, error, isLoading } = useSWR<SchedulesSearchResponse, Error>(
    `/django/core/schedules/search?${apiQueryParams.toString()}`,
  );
  return { data, error, isLoading };
};

interface StatusMessageProps {
  isLoading: boolean;
  error: Error | undefined;
  data: ({ total_results: number } & unknown) | undefined;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  isLoading,
  error,
  data,
}) => {
  if (isLoading) {
    return <li className="mx-auto my-8 w-fit">Loading...</li>;
  }
  if (error) {
    return (
      <li className="mx-auto my-8 w-fit text-important">
        Error: {error.message}
      </li>
    );
  }
  if (!data || data.total_results === 0) {
    return <li className="mx-auto my-8 w-fit">No results found</li>;
  }
  return null;
};

const CourseSearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const currentOption = searchParams.get('navOption') ?? 'courses';
  const currentQuery = searchParams.get('navQuery') ?? '';
  const { data, error, isLoading } = useCoursesSearchResults(currentQuery);
  return (
    <menu>
      <StatusMessage isLoading={isLoading} error={error} data={data} />
      {data && data.total_results > 0
        ? data.items.map((course, i) => (
            <li key={i} className="border-b-2 border-border last:border-b-0">
              <Link
                href={`/courses/${course.department}-${course.course_number}?navOption=${currentOption}`}
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
          ))
        : null}
    </menu>
  );
};

const ProfessorSearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const currentOption = searchParams.get('navOption') ?? 'courses';
  const currentQuery = searchParams.get('navQuery') ?? '';
  const { data, error, isLoading } = useProfessorsSearchResults(currentQuery);
  return (
    <menu>
      <StatusMessage isLoading={isLoading} error={error} data={data} />
      {data && data.total_results > 0
        ? data.items.map((professor, i) => (
            <li key={i} className="border-b-2 border-border last:border-b-0">
              <Link
                href={`/professors/${professor.email.split('@')[0]}?navOption=${currentOption}`}
                className="flex flex-col px-lg py-md animation hover:bg-[rgb(var(--color-primary)/0.15)] focus:bg-[rgb(var(--color-primary)/0.15)]"
              >
                <span className="overflow-ellipsis text-small-lg text-neutral">
                  {professor.email}
                </span>
                <span className="overflow-ellipsis text-p font-bold">
                  {professor.name}
                </span>
              </Link>
            </li>
          ))
        : null}
    </menu>
  );
};

const ScheduleSearchResults: React.FC = () => {
  const searchParams = useSearchParams();
  const currentOption = searchParams.get('navOption') ?? 'courses';
  const currentQuery = searchParams.get('navQuery') ?? '';
  const { data, error, isLoading } = useSchedulesSearchResults(currentQuery);
  return (
    <menu>
      <StatusMessage isLoading={isLoading} error={error} data={data} />
      {data && data.total_results > 0
        ? data.items.map((schedule, i) => (
            <li key={i} className="border-b-2 border-border last:border-b-0">
              <Link
                href={`/courses/${schedule.department}-${schedule.course_number}?navOption=${currentOption}`}
                className="flex flex-col px-lg py-md animation hover:bg-[rgb(var(--color-primary)/0.15)] focus:bg-[rgb(var(--color-primary)/0.15)]"
              >
                <span className="overflow-ellipsis text-small-lg text-neutral">
                  {schedule.department} {schedule.course_number} -{' '}
                  {schedule.section}
                </span>
                <span className="overflow-ellipsis text-p font-bold">
                  {schedule.course_title}
                </span>
                <span className="overflow-ellipsis text-small-sm text-neutral">
                  {schedule.term} {schedule.year} • {schedule.units} Units •{' '}
                  {schedule.class_type}{' '}
                  {schedule.satisfies_area
                    ? `• Satisfies ${schedule.satisfies_area}`
                    : ''}
                </span>
              </Link>
            </li>
          ))
        : null}
    </menu>
  );
};

export const NavSearchBar: React.FC = () => {
  const searchParams = useSearchParams();
  const currentOption = searchParams.get('navOption') ?? 'courses';
  const currentQuery = searchParams.get('navQuery') ?? '';
  return (
    <form
      action={`/${currentOption}/search`}
      className="relative flex whitespace-nowrap"
    >
      <SearchBar
        param="navQuery"
        shouldResetPageOnChange={false}
        className="peer flex-1 [&>input]:!rounded-r-none"
        name="query"
      />
      <ParamSelect
        param="navOption"
        shouldResetPageOnChange={false}
        className="rounded-l-none border-border bg-background"
        defaultValue={currentOption}
        name="navOption"
      >
        <option value="courses">Courses</option>
        <option value="professors">Professors</option>
        <option value="schedules">Schedules</option>
      </ParamSelect>
      {currentQuery ? (
        <Card className="absolute top-[50px] z-50 hidden max-w-[100dvw] shadow-paper hover:block peer-focus-within:block peer-has-[:placeholder-shown]:hidden max-lg:left-[50%] max-lg:hidden max-lg:w-[80dvw] max-lg:-translate-x-[50%] lg:left-0 lg:w-[500px]">
          <SWRConfigProvider>
            {currentOption === 'courses' ? (
              <CourseSearchResults />
            ) : currentOption === 'professors' ? (
              <ProfessorSearchResults />
            ) : currentOption === 'schedules' ? (
              <ScheduleSearchResults />
            ) : null}
          </SWRConfigProvider>
        </Card>
      ) : null}
    </form>
  );
};
