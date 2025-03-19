'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';

import { Card } from '@/components/atoms';
import { ParamSelect, SearchBar } from '@/components/molecules';
import { CoursesSearchResponse, ProfessorsSearchResponse } from '@/types';
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
  const currentOption = searchParams.get('compareOption') ?? 'professors';
  const currentQuery = searchParams.get('compareQuery') ?? '';
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
  const currentOption = searchParams.get('compareOption') ?? 'professors';
  const currentQuery = searchParams.get('compareQuery') ?? '';
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

export const CompareSearchBar: React.FC = () => {
  const searchParams = useSearchParams();
  const currentOption = searchParams.get('compareOption') ?? 'professors';
  const currentQuery = searchParams.get('compareQuery') ?? '';
  return (
    <div className="relative flex whitespace-nowrap">
      <SearchBar
        param="compareQuery"
        shouldResetPageOnChange={false}
        className="peer flex-1 [&>input]:!rounded-r-none"
      />
      <ParamSelect
        param="compareOption"
        shouldResetPageOnChange={false}
        className="rounded-l-none border-border bg-background"
        value={currentOption}
      >
        <option value="professors">Professors</option>
        <option value="courses">Courses</option>
      </ParamSelect>
      {currentQuery ? (
        <Card className="absolute left-0 top-[50px] z-50 hidden w-[1000px] max-w-[80dvw] shadow-paper hover:block peer-focus-within:block peer-has-[:placeholder-shown]:hidden">
          <SWRConfigProvider>
            {currentOption === 'professors' ? (
              <ProfessorSearchResults />
            ) : currentOption === 'courses' ? (
              <CourseSearchResults />
            ) : null}
          </SWRConfigProvider>
        </Card>
      ) : null}
    </div>
  );
};
