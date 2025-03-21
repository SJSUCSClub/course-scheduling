import { Btn, Card } from '@/components/atoms';
import { FilterGroup, PaginationBar } from '@/components/molecules';
import { ProfessorsSearchResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Professors Search',
};

export default async function Page({
  searchParams,
}: {
  searchParams: { query: string; limit: string; page: string };
}) {
  const requestParams = new URLSearchParams();
  searchParams.query && requestParams.append('query', searchParams.query);
  requestParams.append('limit', searchParams.limit ?? '10');
  requestParams.append('page', searchParams.page ?? '1');
  const { total_results, pages, items } = (await fetcher(
    process.env.BASE_API_URL +
      `/core/professors/search?${requestParams.toString()}`,
  )) as ProfessorsSearchResponse;

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
              />
            </div>
          </div>
        ) : null}
        <div className="flex flex-1 flex-col items-stretch gap-md pb-lg pt-lg">
          <div className="flex">
            <p className="flex-1">{total_results ?? '-'} Professor(s)</p>
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
                {items.map((professor, i) => (
                  <li
                    key={i}
                    className="border-b-2 border-border last:border-b-0"
                  >
                    <Link
                      href={`/professors/${professor.email.split('@')[0]}`}
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
