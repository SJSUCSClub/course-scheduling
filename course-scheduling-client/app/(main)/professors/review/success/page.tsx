import { Review } from '@/components/organisms';
import fetcher, { FetchError } from '@/utils/fetcher';
import { getServerSession } from '@/utils/get-server-session';
import SessionProvider from '@/wrappers/session-provider';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    review_id: string;
    professor_id: string;
    course_number: string;
    department: string;
    content: string;
    quality: number;
    ease: number;
    grade?: string;
    take_again?: string;
    tags: string[] | string;
    is_user_anonymous: boolean;
  };
}) {
  const session = getServerSession();
  if (!session) {
    redirect(process.env.BASE_API_URL + '/google/authorize');
  }
  const userId = session?.email.split('@')[0] ?? null;
  const body = {
    professor_id: searchParams.professor_id,
    course_number: searchParams.course_number,
    department: searchParams.department,
    content: searchParams.content,
    quality: searchParams.quality,
    ease: searchParams.ease,
    grade: searchParams.grade,
    tags: Array.isArray(searchParams.tags)
      ? searchParams.tags
      : searchParams.tags
        ? [searchParams.tags]
        : [],
    take_again: searchParams.take_again,
    is_user_anonymous: searchParams.is_user_anonymous,
  };
  try {
    await fetcher(
      process.env.BASE_API_URL +
        `/core/users/reviews${searchParams.review_id ? '/' + searchParams.review_id : ''}`,
      {
        method: searchParams.review_id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookies().toString(),
          'X-CSRFToken': cookies().get('csrftoken')?.value ?? '',
          Referer: process.env.NEXT_PUBLIC_BASE_URL || '',
        },
        body: JSON.stringify(body),
      },
    );
  } catch (error) {
    if (error instanceof FetchError) {
      const info = error.info as { message: string };
      return (
        <main>
          <section className="mx-auto flex w-full max-w-content-width items-stretch px-md">
            <div className="flex w-full flex-col items-center gap-xxl py-xxl">
              <div className="flex flex-col items-stretch">
                <h1 className="pb-sm text-center max-lg:text-h1-mobile-sm lg:text-h1-desktop-sm">
                  Error
                </h1>
                <p className="pb-xxl text-center lg:text-h5-desktop">
                  An error occurred while submitting your review:
                </p>
                <p className="pb-xxl text-center text-important lg:text-h5-desktop">
                  {info.message}
                </p>
              </div>
            </div>
          </section>
        </main>
      );
    }
  }
  return (
    <main>
      <section className="mx-auto flex w-full max-w-content-width items-stretch px-md">
        <div className="flex w-full flex-col items-center gap-xxl py-xxl">
          <div className="flex flex-col items-stretch">
            <h1 className="pb-sm text-center max-lg:text-h1-mobile-sm lg:text-h1-desktop-sm">
              Review {searchParams.review_id ? 'Updated' : 'Submitted'}!
            </h1>
            <p className="pb-xxl text-center lg:text-h5-desktop">
              Thank you for reviewing Professor{' '}
              <Link
                className="w-fit rounded-sm text-text underline hover:text-secondary"
                href={`/professors/${searchParams.professor_id}`}
              >
                {searchParams.professor_id
                  .split('.')
                  .map((p) => p[0].toUpperCase() + p.slice(1))
                  .join(' ')}
              </Link>
              ! We appreciate your feedback.
            </p>
            <SessionProvider>
              <Review
                link={`/professors/${searchParams.professor_id}`}
                title={`${searchParams.department} ${searchParams.course_number}`}
                name={
                  searchParams.is_user_anonymous
                    ? 'Anonymous'
                    : `${session?.first_name} ${session?.last_name}`
                }
                createdAt={new Date().toISOString()}
                updatedAt={null}
                content={searchParams.content}
                quality={searchParams.quality}
                ease={searchParams.ease}
                grade={searchParams.grade ?? null}
                tags={
                  Array.isArray(searchParams.tags)
                    ? searchParams.tags
                    : searchParams.tags
                      ? [searchParams.tags]
                      : []
                }
                takeAgain={
                  searchParams.take_again === 'true'
                    ? true
                    : searchParams.take_again === 'false'
                      ? false
                      : null
                }
                votes={{ upvotes: 0, downvotes: 0 }}
                userId={userId}
                id="1"
                isShownInteractions={false}
                userVote={null}
                professorId={searchParams.professor_id}
                courseId={`${searchParams.department}-${searchParams.course_number}`}
              />
            </SessionProvider>
          </div>
        </div>
      </section>
    </main>
  );
}
