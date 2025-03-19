export const revalidate = 3600; // revalidate at most once an hour

import { titlingGothicFB } from '@/app/fonts';
import { Card, LinkBtn } from '@/components/atoms';
import { CoursesHighestRatedResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import getEvaluation from '@/utils/get-evaluation';

export default async function Page() {
  const data = (await fetcher(
    process.env.BASE_API_URL + '/core/courses/highest_rated',
  )) as CoursesHighestRatedResponse;

  return (
    <>
      <h1
        className={`pb-md pt-xl ${titlingGothicFB.className} max-lg:text-[1.5rem] lg:text-[2rem]`}
      >
        <span className="text-primary">Top Rated</span> Courses
      </h1>
      <div className="flex w-full flex-row flex-wrap items-center justify-around gap-[20px]">
        {data.highest_rated.map(
          ({ department, course_number, name, avg_rating, total_reviews }) => (
            <LinkBtn
              key={name}
              href={`/courses/${department}-${course_number}`}
              variant="tertiary"
              className="flex-1 p-0 text-inherit"
              aria-label="Review Professors"
            >
              <Card className="flex w-full flex-col justify-center p-xl max-lg:h-[275px] lg:h-[325px]">
                <div className="flex flex-col pb-sm">
                  <h2 className="text-center text-h4-mobile text-text lg:text-h4-desktop">
                    {name}
                  </h2>
                  <h3 className="text-center text-p text-neutral">
                    {total_reviews} total reviews
                  </h3>
                </div>

                <h3
                  className={`text-${getEvaluation(avg_rating || 0)} text-center !font-extrabold max-lg:text-h1-mobile-lg lg:text-h1-desktop-lg`}
                >
                  {Math.round((avg_rating || 0) * 10) / 10}
                  <span className="!font-normal italic max-lg:text-h1-mobile-sm lg:text-h1-desktop-sm">
                    /5
                  </span>
                </h3>
              </Card>
            </LinkBtn>
          ),
        )}
      </div>
    </>
  );
}
