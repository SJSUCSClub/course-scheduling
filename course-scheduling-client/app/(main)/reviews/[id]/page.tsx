import { titlingGothicFB } from '@/app/fonts';
import { Review } from '@/components/organisms';
import { GetReviewsResponse } from '@/types/core/reviews';
import fetcher from '@/utils/fetcher';

export default async function Page({ params }: { params: { id: string } }) {
  const data = (await fetcher(
    process.env.BASE_API_URL + `/core/reviews/${params.id}`,
  )) as GetReviewsResponse;

  return (
    <main className="mx-auto w-full max-w-content-width px-md pb-lg">
      <h1
        className={`pb-md pt-xl ${titlingGothicFB.className} max-lg:text-[1.5rem] lg:text-[2rem]`}
      >
        Review {params.id}
      </h1>
      <Review
        link={`/professors/${data.professor_id}`}
        title={data.professor_name}
        name={data.reviewer_name ?? data.reviewer_username ?? 'Anonymous User'}
        createdAt={data.created_at}
        updatedAt={data.updated_at}
        content={data.content}
        quality={data.quality}
        ease={data.ease}
        grade={data.grade}
        tags={data.tags}
        takeAgain={data.take_again}
        votes={{ upvotes: 0, downvotes: 0 }}
        userId={data.user_id}
        id={data.id.toString()}
        userVote={data.user_vote}
        professorId={data.professor_id}
        courseId={`${data.department}-${data.course_number}`}
        isShownInteractions={false}
      />
    </main>
  );
}
