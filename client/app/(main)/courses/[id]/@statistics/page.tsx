import { Card, Stars } from '@/components/atoms';
import { ParamSelect } from '@/components/molecules';
import StatCard from '@/components/molecules/stat-card';
import { BarChart } from '@/components/organisms';
import {
  CoursesIDReviewStatsResponse,
  CoursesIDSummaryResponse,
} from '@/types';
import { cn } from '@/utils/cn';
import fetcher from '@/utils/fetcher';
import getEvaluation from '@/utils/get-evaluation';
import roundToTenth from '@/utils/round-to-tenth';
import {
  ClipboardDocumentCheckIcon,
  PuzzlePieceIcon,
  Square2StackIcon,
} from '@heroicons/react/16/solid';
import {
  ArrowPathIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { type: string };
}) {
  const {
    name,
    course_number,
    department,
    prereqs,
    satisfies_area,
    units,
    description,
  } = (await fetcher(
    process.env.BASE_API_URL + `/core/courses/${params.id}/summary`,
  )) as CoursesIDSummaryResponse;
  const {
    total_reviews,
    avg_rating,
    avg_quality,
    avg_ease,
    avg_grade,
    take_again_percent,
    rating_distribution,
    quality_distribution,
    ease_distribution,
    grade_distribution,
  } = (await fetcher(
    process.env.BASE_API_URL + `/core/courses/${params.id}/reviews-stats`,
  )) as CoursesIDReviewStatsResponse;
  const review = roundToTenth(
    (searchParams.type === 'rating'
      ? avg_rating
      : searchParams.type === 'quality'
        ? avg_quality
        : searchParams.type === 'ease'
          ? avg_ease
          : avg_rating) ?? 0,
  );
  const takeAgainPercent = roundToTenth(take_again_percent ?? 0);
  const reviewDistribution =
    searchParams.type === 'rating'
      ? rating_distribution
      : searchParams.type === 'quality'
        ? quality_distribution
        : searchParams.type === 'ease'
          ? ease_distribution
          : rating_distribution;

  return (
    <section className="mx-auto w-full max-w-content-width px-md pb-lg">
      <div className="flex flex-wrap items-center justify-between pb-md">
        <p>Statistics</p>
        <ParamSelect param="type" shouldResetPageOnChange={false}>
          <option value="rating">Rating</option>
          <option value="quality">Quality</option>
          <option value="ease">Ease</option>
        </ParamSelect>
      </div>
      <div className="pb-md">
        <div>
          <h1 className="pb-xs max-lg:text-h3-mobile lg:text-h3-desktop">{`${department} ${course_number}`}</h1>
          <h2 className="pb-sm !font-bold text-neutral max-lg:text-h5-mobile lg:text-h5-desktop">
            {name}
          </h2>
          <div className="flex items-center gap-md pb-md">
            {review ? (
              <p className="!font-bold">{review}</p>
            ) : (
              <p className="!font-bold text-neutral opacity-50">-</p>
            )}
            <div className={cn('w-[130px]', { 'opacity-50': !review })}>
              <Stars rating={review ?? 0} />
            </div>
            <p className="text-small-lg text-neutral">
              {total_reviews} Reviews
            </p>
          </div>
        </div>
        {description ? (
          <p className="pb-md">{description}</p>
        ) : (
          <p className="pb-md italic text-neutral opacity-50">
            No description.
          </p>
        )}
        <div className="pb-md text-small-lg text-neutral">
          {prereqs ? (
            <p className="flex gap-md">
              <span>
                <ClipboardDocumentCheckIcon width={16} height={16} />
              </span>
              {prereqs}
            </p>
          ) : null}
          {satisfies_area ? (
            <p className="flex gap-md">
              <span>
                <PuzzlePieceIcon width={16} height={16} />
              </span>
              Satisfies {satisfies_area}
            </p>
          ) : null}

          {units ? (
            <p className="flex gap-md">
              <span>
                <Square2StackIcon width={16} height={16} />
              </span>
              {units} Units
            </p>
          ) : null}
        </div>
        <div className="flex gap-md max-lg:flex-wrap">
          {avg_grade ? (
            <StatCard
              className="flex flex-1 items-center gap-md max-lg:p-lg lg:px-xxl lg:py-xl"
              variant={getEvaluation(avg_grade, 'grade')}
            >
              <ClipboardDocumentListIcon className="max-lg:h-[24px] max-lg:w-[24px] lg:h-[48px] lg:w-[48px]" />
              <div>
                <p className="max-lg:text-h4-mobile lg:text-h4-desktop">
                  {avg_grade}
                </p>
                <p>Average Grade</p>
              </div>
            </StatCard>
          ) : (
            <StatCard className="flex flex-1 items-center gap-md max-lg:p-lg lg:px-xxl lg:py-xl">
              <ClipboardDocumentListIcon className="max-lg:h-[24px] max-lg:w-[24px] lg:h-[48px] lg:w-[48px]" />
              <div>
                <p className="max-lg:text-h4-mobile lg:text-h4-desktop">-</p>
                <p>Average Grade</p>
              </div>
            </StatCard>
          )}
          {take_again_percent ? (
            <StatCard
              className="flex flex-1 items-center gap-md max-lg:p-lg lg:px-xxl lg:py-xl"
              variant={getEvaluation(take_again_percent, 'percentage')}
            >
              <ArrowPathIcon className="max-lg:h-[24px] max-lg:w-[24px] lg:h-[48px] lg:w-[48px]" />
              <div>
                <p className="max-lg:text-h4-mobile lg:text-h4-desktop">
                  {takeAgainPercent}%
                </p>
                <p>Would Take Again</p>
              </div>
            </StatCard>
          ) : (
            <StatCard className="flex flex-1 items-center gap-md max-lg:p-lg lg:px-xxl lg:py-xl">
              <ArrowPathIcon className="max-lg:h-[24px] max-lg:w-[24px] lg:h-[48px] lg:w-[48px]" />
              <div>
                <p className="max-lg:text-h4-mobile lg:text-h4-desktop">-</p>
                <p>Would Take Again</p>
              </div>
            </StatCard>
          )}
        </div>
      </div>
      <div className="flex gap-md pb-md max-lg:flex-col">
        <Card className="p-lg max-lg:w-full lg:flex-1">
          <p className="pb-sm font-bold">Rating Distribution</p>
          <BarChart
            series={[
              {
                name: 'Rating Distribution',
                data: reviewDistribution.reverse(),
              },
            ]}
            categories={[5, 4, 3, 2, 1]}
          />
        </Card>
        <Card className="p-lg max-lg:w-full lg:flex-1">
          <p className="pb-sm font-bold">Grade Distribution</p>
          <BarChart
            series={[{ name: 'Grade Distribution', data: grade_distribution }]}
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
