import { ParamSelect } from '@/components/molecules';
import { Review } from '@/components/organisms';
import { UsersProfileResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'My Profile',
};

export default async function Page({
  searchParams,
}: {
  searchParams: { view: string };
}) {
  const data = (await fetcher(
    process.env.BASE_API_URL + '/core/users/profile',
    {
      headers: {
        Cookie: cookies().toString(),
      },
    },
  )) as UsersProfileResponse;
  return (
    <main>
      <section className="mx-auto w-full max-w-content-width px-md pb-lg pt-xxl">
        <div className="flex flex-wrap items-center justify-between pb-md">
          <h1 className="pb-xs max-lg:text-h3-mobile lg:text-h3-desktop">
            My Profile
          </h1>
          <ParamSelect param="view" shouldResetPageOnChange={false}>
            <option value="reviews">Reviews</option>
            <option value="votes">Votes</option>
            {/* TODO: Implement comments view */}
            {/* <option value="comments">Comments</option> */}
          </ParamSelect>
        </div>
        <div className="flex flex-1 flex-col items-stretch gap-md pb-lg">
          {searchParams.view === 'votes' ? (
            data.reviews_voted.length > 0 ? (
              data.reviews_voted.map((item, i) => (
                <Review
                  key={i}
                  link={`/professors/${item.professor_id}`}
                  title={item.professor_name}
                  name={
                    item.reviewer_name ??
                    item.reviewer_username ??
                    'Anonymous User'
                  }
                  createdAt={item.created_at}
                  updatedAt={item.updated_at}
                  content={item.content}
                  quality={item.quality}
                  ease={item.ease}
                  grade={item.grade}
                  tags={item.tags}
                  takeAgain={item.take_again}
                  votes={item.votes}
                  userId={item.user_id}
                  id={item.id.toString()}
                  userVote={item.user_vote}
                  professorId={item.professor_id}
                  courseId={`${item.department}-${item.course_number}`}
                />
              ))
            ) : (
              <p className="w-full p-md text-center italic text-neutral">
                You haven&apos;t interacted with any reviews.
              </p>
            )
          ) : data.reviews.length > 0 ? (
            data.reviews.map((item, i) => (
              <Review
                key={i}
                link={`/professors/${item.professor_id}`}
                title={item.professor_name}
                name={
                  item.reviewer_name ??
                  item.reviewer_username ??
                  'Anonymous User'
                }
                createdAt={item.created_at}
                updatedAt={item.updated_at}
                content={item.content}
                quality={item.quality}
                ease={item.ease}
                grade={item.grade}
                tags={item.tags}
                takeAgain={item.take_again}
                votes={item.votes}
                userId={item.user_id}
                id={item.id.toString()}
                userVote={item.user_vote}
                professorId={item.professor_id}
                courseId={`${item.department}-${item.course_number}`}
              />
            ))
          ) : (
            <p className="w-full p-md text-center italic text-neutral">
              You haven&apos;t written any reviews.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
