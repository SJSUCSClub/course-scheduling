import { Card, Tag } from '@/components/atoms';
import { ParamSelect } from '@/components/molecules';
import StatCard from '@/components/molecules/stat-card';
import { BarChart } from '@/components/organisms';
import {
  ArrowPathIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

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
      <div className="pb-md">
        <div>
          <h1 className="pb-xs max-lg:text-h3-mobile lg:text-h3-desktop">
            Loading...
          </h1>
          <h2 className="pb-sm !font-bold text-neutral max-lg:text-h5-mobile lg:text-h5-desktop">
            -
          </h2>
          <div className="flex items-center gap-md pb-md">
            <p className="!font-bold text-neutral opacity-50">-</p>
            <p className="pl-[130px] text-small-lg text-neutral">- Reviews</p>
          </div>
        </div>
        <p className="pb-md opacity-50">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec
          purus nec libero ultricies lacinia. Nullam nec purus nec libero
          ultricies lacinia.
        </p>
        <div className="flex gap-md max-lg:flex-wrap">
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
      <div className="flex min-w-min flex-wrap justify-center gap-md pb-xl text-neutral">
        {Array.from({ length: 5 }, (_, i) => (
          <Tag key={i} disabled className="h-[40px] w-[150px] cursor-default" />
        ))}
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
