import { Btn, Card, LinkBtn, Stars, Tag } from '@/components/atoms';
import { ParamSelect } from '@/components/molecules';
import StatCard from '@/components/molecules/stat-card';
import { BarChart } from '@/components/organisms';
import {
  ProfessorsIDReviewStatsResponse,
  ProfessorsIDSummaryResponse,
} from '@/types';
import { cn } from '@/utils/cn';
import fetcher from '@/utils/fetcher';
import getEvaluation from '@/utils/get-evaluation';
import roundToTenth from '@/utils/round-to-tenth';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import {
  ArrowPathIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { type: string };
}) {
  const { name, email } = (await fetcher(
    process.env.BASE_API_URL + `/core/professors/${params.id}/summary`,
  )) as ProfessorsIDSummaryResponse;
  const {
    total_reviews,
    avg_rating,
    avg_quality,
    avg_ease,
    avg_grade,
    take_again_percent,
    tags,
    rating_distribution,
    ease_distribution,
    quality_distribution,
    grade_distribution,
  } = (await fetcher(
    process.env.BASE_API_URL + `/core/professors/${params.id}/reviews-stats`,
  )) as ProfessorsIDReviewStatsResponse;
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
      <div className="flex gap-md pb-md max-lg:flex-col">
        <Card className="flex flex-1 justify-stretch gap-md max-lg:items-start max-lg:p-lg lg:items-end lg:p-xxl">
          <div className="w-lg lg:hidden" />
          <p className="text-small-sm max-lg:hidden">{total_reviews} Reviews</p>
          <div className="flex flex-1 flex-col items-center justify-center gap-xs py-md max-lg:px-lg lg:px-xxl">
            <h1 className="text-center max-lg:text-h4-mobile lg:text-h4-desktop">
              {name}
            </h1>
            {review ? (
              <h2 className="text-center !font-extrabold max-lg:text-h1-mobile-lg lg:text-h1-desktop-lg">
                {review}
                <span className="!font-normal italic max-lg:text-h1-mobile-sm lg:text-h1-desktop-sm">
                  /5
                </span>
              </h2>
            ) : (
              <p className="text-center italic text-neutral opacity-50">
                No reviews. Be the first to write one!
              </p>
            )}
            <div className={cn('max-lg:w-[130px]', { 'opacity-50': !review })}>
              <Stars rating={review ?? 0} />
            </div>
          </div>
          <Btn
            className="rounded-sm p-0 text-text"
            variant="tertiary"
            popoverTarget="stat-actions"
          >
            <EllipsisVerticalIcon width={24} height={24} />
          </Btn>
          <dialog
            popover="auto"
            id="stat-actions"
            className="bg-[#00000000] backdrop:bg-text backdrop:opacity-25"
          >
            <Card className="p-md">
              <p className="pb-sm font-bold">Contact Info</p>
              <p>
                Email:{' '}
                <LinkBtn
                  className="rounded-sm p-0 text-text underline hover:text-secondary"
                  variant="tertiary"
                  href={`mailto:${email}`}
                >
                  {email}
                </LinkBtn>
              </p>
            </Card>
          </dialog>
        </Card>
        <div className="flex gap-md max-lg:flex-wrap lg:flex-col">
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
      {tags ? (
        <div className="flex min-w-min flex-wrap justify-center gap-md pb-md text-neutral">
          {tags.map((t, i) => (
            <Tag
              key={i}
              disabled
              className="flex cursor-default gap-md whitespace-nowrap"
            >
              {t.tag} <span>{t.count}</span>
            </Tag>
          ))}
        </div>
      ) : null}
      <div className="flex min-w-min flex-wrap justify-center gap-md pb-xl">
        <LinkBtn
          variant="primary"
          href={`/professors/review?professor_id=${params.id}`}
        >
          Write a Review
          <ChevronRightIcon width={20} height={20} />
        </LinkBtn>
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
            series={[
              {
                name: 'Grade Distribution',
                data: grade_distribution,
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
