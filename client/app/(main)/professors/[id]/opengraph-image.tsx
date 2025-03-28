import {
  ProfessorsIDReviewStatsResponse,
  ProfessorsIDSummaryResponse,
} from '@/types';
import fetcher from '@/utils/fetcher';
import getEvaluation from '@/utils/get-evaluation';
import roundToTenth from '@/utils/round-to-tenth';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Professor Page';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const { name } = (await fetcher(
    process.env.BASE_API_URL + `/core/professors/${params.id}/summary`,
  )) as ProfessorsIDSummaryResponse;
  const { avg_rating, total_reviews, avg_grade, take_again_percent } =
    (await fetcher(
      process.env.BASE_API_URL + `/core/professors/${params.id}/reviews-stats`,
    )) as ProfessorsIDReviewStatsResponse;
  const review = roundToTenth(avg_rating ?? 0);
  const takeAgainPercent = roundToTenth(take_again_percent ?? 0);

  const interItalic = fetch(
    new URL('./Inter_24pt-Italic.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());
  const interBold = fetch(
    new URL('./Inter_24pt-Bold.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());
  const interExtraBold = fetch(
    new URL('./Inter_24pt-ExtraBold.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div tw="flex flex-1 flex-col w-full h-full bg-[#1e1e1e] text-[#f0f0f0] p-[6rem] h-full justify-center py-[16px]">
        <svg
          width="108"
          height="46"
          viewBox="0 0 54 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: '16px' }}
        >
          <path
            d="M14.9465 14.023C14.9465 15.6514 14.3291 17.1345 13.3131 18.2417C12.1934 19.4784 10.5882 20.2512 8.80717 20.2512C7.02616 20.2512 5.41677 19.4795 4.29606 18.2417C3.28731 17.1345 2.66992 15.6514 2.66992 14.023C2.66992 10.5888 5.422 7.79688 8.80717 7.79688C12.1923 7.79688 14.9465 10.5888 14.9465 14.023Z"
            fill="#F1B947"
          />
          <path
            d="M42.3308 0C37.4555 0 33.3013 3.11996 31.6992 7.49894C31.3811 7.37792 31.0577 7.27388 30.7396 7.17622C29.4421 6.78875 28.1142 6.59342 26.7726 6.59342C25.4311 6.59342 24.1053 6.78769 22.8078 7.17622C22.5242 7.26433 22.2364 7.35563 21.9518 7.46072C20.3403 3.10297 16.1954 0 11.3359 0C5.07513 0 0 5.14862 0 11.5C0 17.8514 5.07513 23 11.3359 23C12.1563 23 12.9568 22.9119 13.7269 22.742C17.8844 21.8386 21.1952 18.621 22.2866 14.483C22.4541 13.8482 22.5702 13.1911 22.6278 12.517C22.9051 12.0255 23.332 11.6497 23.8427 11.4745C24.7939 11.1486 25.7754 10.9798 26.7726 10.9798C27.7699 10.9798 28.7535 11.1486 29.7047 11.4745C30.321 11.6847 30.8171 12.1921 31.0734 12.8365C31.1153 13.2229 31.1791 13.603 31.2607 13.9777C32.1983 18.3121 35.5458 21.7314 39.8079 22.7134C40.6189 22.9013 41.4633 22.9989 42.3319 22.9989C48.5926 22.9989 53.6677 17.8503 53.6677 11.4989C53.6677 5.14756 48.5905 0 42.3308 0ZM15.8428 15.7187C14.7231 16.9554 13.1179 17.7282 11.3369 17.7282C9.5559 17.7282 7.94651 16.9565 6.82579 15.7187C5.81705 14.6115 5.19966 13.1284 5.19966 11.5C5.19966 8.06582 7.95174 5.27389 11.3369 5.27389C14.7221 5.27389 17.4763 8.06582 17.4763 11.5C17.4763 13.1284 16.8589 14.6115 15.8428 15.7187ZM37.7025 15.7187C36.6875 14.6115 36.069 13.1284 36.069 11.5C36.069 8.06582 38.8263 5.27389 42.2063 5.27389C45.5862 5.27389 48.3456 8.06582 48.3456 11.5C48.3456 13.1284 47.7282 14.6115 46.7174 15.7187C45.5977 16.9554 43.9873 17.7282 42.2063 17.7282C40.4253 17.7282 38.8211 16.9565 37.7014 15.7187H37.7025Z"
            fill="#F1B947"
          />
          <path
            d="M45.8189 14.023C45.8189 15.6514 45.2015 17.1345 44.1907 18.2417C43.071 19.4784 41.4606 20.2512 39.6796 20.2512C37.8986 20.2512 36.2944 19.4795 35.1747 18.2417C34.1597 17.1345 33.5413 15.6514 33.5413 14.023C33.5413 10.5888 36.2986 7.79688 39.6785 7.79688C43.0584 7.79688 45.8179 10.5888 45.8179 14.023H45.8189Z"
            fill="#F1B947"
          />
        </svg>
        <p
          style={{ fontFamily: 'Inter-Bold', fontWeight: 700 }}
          tw="text-center text-[4rem] leading-[4rem]"
        >
          {name}
        </p>
        {review ? (
          <p
            style={{
              fontFamily: 'Inter-ExtraBold',
              fontWeight: 800,
              color:
                getEvaluation(review, 'rating') === 'bad'
                  ? '#ff9c9c'
                  : getEvaluation(review, 'rating') === 'ok'
                    ? '#ffdeb0'
                    : '#a4ffe8',
            }}
            tw="text-center flex items-center leading-[3.5rem] text-[3.5rem]"
          >
            {review}
            <span tw="pl-[1rem]">
              {review >= 4.5 ? (
                <span>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              ) : review >= 3.5 ? (
                <span>&#9733;&#9733;&#9733;&#9733;&#9734;</span>
              ) : review >= 2.5 ? (
                <span>&#9733;&#9733;&#9733;&#9734;&#9734;</span>
              ) : review >= 1.5 ? (
                <span>&#9733;&#9733;&#9734;&#9734;&#9734;</span>
              ) : review >= 0.5 ? (
                <span>&#9733;&#9734;&#9734;&#9734;&#9734;</span>
              ) : (
                <span>&#9734;&#9734;&#9734;&#9734;&#9734;</span>
              )}
            </span>
            <span
              style={{
                fontFamily: 'Inter-Italic',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
              tw="text-[1.5rem] pl-[1rem] leading-[1.15rem] text-[#8b8b8b]"
            >
              {total_reviews} Reviews
            </span>
          </p>
        ) : (
          <p
            style={{
              fontFamily: 'Inter-Italic',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
            tw="text-center text-[1rem] leading-[1.25rem] text-[#8b8b8b] opacity-50"
          >
            No reviews. Be the first to write one!
          </p>
        )}
        <p tw="flex items-center text-[2.5rem] text-[#8b8b8b]">
          📝<span tw="pl-[1rem]">Average Grade:</span>
          {avg_grade ? (
            <span
              style={{
                color:
                  getEvaluation(avg_grade, 'grade') === 'good'
                    ? '#a4ffe8'
                    : getEvaluation(avg_grade, 'grade') === 'ok'
                      ? '#ffdeb0'
                      : '#ff9c9c',
              }}
              tw="pl-[1rem]"
            >
              {avg_grade}
            </span>
          ) : (
            <span tw="pl-[1rem]">-</span>
          )}
        </p>
        <p tw="flex items-center text-[2.5rem] text-[#8b8b8b]">
          🔃<span tw="pl-[1rem]">Would Take Again:</span>
          {takeAgainPercent ? (
            <span
              style={{
                color:
                  getEvaluation(takeAgainPercent, 'percentage') === 'good'
                    ? '#a4ffe8'
                    : getEvaluation(takeAgainPercent, 'percentage') === 'ok'
                      ? '#ffdeb0'
                      : '#ff9c9c',
              }}
              tw="pl-[1rem]"
            >
              {takeAgainPercent}%
            </span>
          ) : (
            <span tw="pl-[1rem]">-</span>
          )}
        </p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter-Italic',
          data: await interItalic,
          style: 'italic',
          weight: 400,
        },
        {
          name: 'Inter-Bold',
          data: await interBold,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Inter-ExtraBold',
          data: await interExtraBold,
          style: 'normal',
          weight: 800,
        },
      ],
    },
  );
}
