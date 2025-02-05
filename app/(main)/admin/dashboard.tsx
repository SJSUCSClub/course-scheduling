import { RoleContext } from '@/app/(main)/admin/check';
import { Card, LinkBtn } from '@/components/atoms';
import { PaginationBar } from '@/components/molecules';
import { Review } from '@/components/organisms';
import { AdminFlaggedReviewsResponse } from '@/types';
import dayjs from 'dayjs';
import { useContext } from 'react';
import useSWR from 'swr';

export const Dashboard: React.FC = () => {
  const role = useContext(RoleContext);
  const { data } = useSWR<AdminFlaggedReviewsResponse>(
    '/django/admin/flagged-reviews',
  );

  return (
    <section className="mx-auto w-full max-w-content-width px-md pb-lg pt-xxl">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="pb-xs max-lg:text-h3-mobile lg:text-h3-desktop">
            Admin Dashboard
          </h1>
          <h2 className="pb-xl text-neutral max-lg:text-h5-mobile lg:text-h5-desktop">
            Review user reports and moderate content.
          </h2>
        </div>
        {role === 'Administrator' && (
          <div className="px-md pb-lg">
            <LinkBtn variant="primary" href={'/admin/manage'}>
              Manage Admins
            </LinkBtn>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col items-stretch gap-md pb-lg">
        {data?.items.map((val) => (
          <div
            key={`review${val.id}`}
            className="flex w-full flex-row gap-[20px]"
          >
            <div className="sticky top-2 h-min w-2/3">
              <Review
                link={`/professors/${val.professor_id}`}
                title={val.professor_name}
                name={
                  val.reviewer_name ?? val.reviewer_username ?? 'Anonymous User'
                }
                createdAt={val.created_at}
                updatedAt={val.updated_at}
                content={val.content}
                quality={val.quality}
                ease={val.ease}
                grade={val.grade}
                tags={val.tags}
                takeAgain={val.take_again}
                votes={{ upvotes: 0, downvotes: 0 }}
                userId={val.user_id}
                id={val.id.toString()}
                userVote={null}
                professorId={val.professor_id}
                courseId={`${val.department}-${val.course_number}`}
              />
            </div>
            <div className="flex w-1/3 flex-col gap-[20px]">
              {val.flags.map((fval, fidx) => (
                <Card
                  key={`review${val.id}flag${fidx}`}
                  className="flex flex-col p-4"
                >
                  <div className="flex flex-row justify-between">
                    <p className="font-bold text-text">{fval.user_id}</p>
                    <p className="text-right text-small-lg font-bold uppercase text-neutral">
                      {dayjs(fval.created_at).format('MMM D, YYYY')}
                    </p>
                  </div>
                  <p className="text-wrap text-text">{fval.reason}</p>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-row justify-center">
        <PaginationBar totalPages={data?.pages ?? 0} />
      </div>
    </section>
  );
};
