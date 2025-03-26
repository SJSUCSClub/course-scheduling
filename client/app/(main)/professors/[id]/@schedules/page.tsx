'use client';

import { Schedule } from '@/components/organisms';
import { ProfessorsIDSchedulesResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import Loading from './loading';
import useSWRInfinite from 'swr/infinite';
import { Btn, Spinner } from '@/components/atoms';

const getKey =
  (id: string) =>
  (pageIndex: number, previousPageData: ProfessorsIDSchedulesResponse) => {
    if (previousPageData && previousPageData.page === previousPageData.pages)
      return null;
    return `/api/core/professors/${id}/schedules?limit=4&page=${pageIndex + 1}`;
  };

export default function Page({ params }: { params: { id: string } }) {
  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<ProfessorsIDSchedulesResponse>(getKey(params.id), fetcher, {
      revalidateOnFocus: false,
    });
  if (isLoading) return <Loading />;
  if (error || !data) throw error;
  const { total_results, pages } = data[0];
  const items = data.flatMap((d) => d.items);
  return (
    <section className="mx-auto w-full max-w-content-width px-md">
      <p className="pb-md">{total_results} Schedule(s)</p>
      <div className="grid gap-md pb-md max-lg:grid-cols-1 lg:grid-cols-2">
        {items.map((item, i) => (
          <Schedule
            key={i}
            link={`/courses/${item.department}-${item.course_number}`}
            subtitle={`${item.department} ${item.course_number} - ${item.section}`}
            title={item.course_title}
            details={[
              `${item.term} ${item.year}`,
              // TODO: Uncomment when satisfies_area is added to the response
              // item.satisfies_area ? `Satisfies ${item.satisfies_area}` : '',
              `${item.units ?? '-'} Units`,
              item.class_type,
            ]}
            dates={item.dates}
            times={item.times}
            location={item.location ?? '-'}
            modeOfInstruction={item.mode_of_instruction}
            days={item.days}
          />
        ))}
      </div>
      {(pages > 0 && size !== pages) || isLoading || isValidating ? (
        <div className="flex w-full justify-center pb-md">
          <Btn
            className="gap-md"
            variant="tertiary"
            disabled={isLoading || isValidating}
            onClick={() => setSize(size + 1)}
          >
            {size !== pages ? 'Load more' : null}
            {isLoading || isValidating ? <Spinner /> : null}
          </Btn>
        </div>
      ) : null}
    </section>
  );
}
