import { Btn, Card, Tag } from '@/components/atoms';
import { ParamSelect } from '@/components/molecules';
import StatCard from '@/components/molecules/stat-card';
import { BarChart } from '@/components/organisms';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import {
  ArrowPathIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

export default function Loading() {
  return (
    <section className="mx-auto w-full max-w-content-width animate-pulse px-md text-neutral">
      <div className="flex flex-wrap items-center justify-between pb-md">
        <p>Statistics</p>
        <ParamSelect disabled param="type" shouldResetPageOnChange={false}>
          <option value="rating">Rating</option>
          <option value="quality">Quality</option>
          <option value="ease">Ease</option>
        </ParamSelect>
      </div>
      <div className="flex gap-md pb-md max-lg:flex-col">
        <Card className="flex flex-1 justify-stretch gap-md max-lg:items-start max-lg:p-lg lg:items-end lg:p-xxl">
          <p className="text-small-sm max-lg:hidden">- Reviews</p>
          <div className="flex flex-1 flex-col items-center justify-center gap-xs py-md max-lg:px-lg lg:px-xxl">
            <h1 className="text-center max-lg:text-h4-mobile lg:text-h4-desktop">
              Loading...
            </h1>

            <p className="text-center !font-extrabold max-lg:text-h1-mobile-lg lg:text-h1-desktop-lg">
              -
              <span className="!font-normal italic max-lg:text-h1-mobile-sm lg:text-h1-desktop-sm">
                /5
              </span>
            </p>
          </div>
          <Btn className="rounded-sm p-0 text-text" variant="tertiary" disabled>
            <EllipsisVerticalIcon width={24} height={24} />
          </Btn>
        </Card>
        <div className="flex gap-md max-lg:flex-wrap lg:flex-col">
          <StatCard className="flex flex-1 items-center gap-md max-lg:p-lg lg:px-xxl lg:py-xl">
            <ClipboardDocumentListIcon className="max-lg:h-[25px] max-lg:w-[24px] lg:h-[48px] lg:w-[48px]" />
            <div>
              <p className="max-lg:text-h4-mobile lg:text-h4-desktop">-</p>
              <p>Average Grade</p>
            </div>
          </StatCard>
          <StatCard className="flex flex-1 items-center gap-md max-lg:p-lg lg:px-xxl lg:py-xl">
            <ArrowPathIcon className="max-lg:h-[24px] max-lg:w-[24px] lg:h-[48px] lg:w-[48px]" />
            <div>
              <p className="max-lg:text-h4-mobile lg:text-h4-desktop">-</p>
              <p>Would Take Again</p>
            </div>
          </StatCard>
        </div>
      </div>
      <div className="flex min-w-min flex-wrap justify-center gap-md pb-md text-neutral">
        {Array.from({ length: 5 }, (_, i) => (
          <Tag key={i} disabled className="h-[40px] w-[150px] cursor-default" />
        ))}
      </div>
      <div className="flex min-w-min flex-wrap justify-center gap-md pb-md">
        <Btn disabled variant="primary">
          Write a Review
          <ChevronRightIcon width={20} height={20} />
        </Btn>
      </div>
      <div className="flex gap-md pb-md max-lg:flex-col">
        <Card className="p-lg max-lg:w-full lg:flex-1">
          <p className="pb-sm font-bold">Rating Distribution</p>
          <BarChart
            series={[
              {
                name: 'Rating Distribution',
                data: [],
              },
            ]}
            categories={[5, 4, 3, 2, 1]}
          />
        </Card>
        <Card className="p-lg max-lg:w-full lg:flex-1">
          <p className="pb-sm font-bold">Grade Distribution</p>
          <BarChart
            series={[
              {
                name: 'Grade Distribution',
                data: [],
              },
            ]}
            categories={[
              'A+',
              'A',
              'A-',
              'B+',
              'B',
              'B-',
              'C+',
              'C',
              'C-',
              'D+',
              'D',
              'D-',
              'F',
            ]}
          />
        </Card>
      </div>
    </section>
  );
}
