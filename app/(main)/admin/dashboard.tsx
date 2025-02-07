import { RoleContext } from '@/app/(main)/admin/check';
import { Btn, Card, LinkBtn } from '@/components/atoms';
import { PaginationBar } from '@/components/molecules';
import { Review } from '@/components/organisms';
import { AdminFlaggedReviewsResponse } from '@/types';
import dayjs from 'dayjs';
import React, { useContext } from 'react';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';

export const Dashboard: React.FC = () => {
  const role = useContext(RoleContext);
  const { data, mutate } = useSWR<AdminFlaggedReviewsResponse>(
    '/django/admin/flagged-reviews',
  );

  const [cookies] = useCookies(['csrftoken']);
  // TODO - show errors
  const handleAction = async (review_id: number, action: boolean) => {
    await fetch(`/django/admin/reviews/${review_id}/manage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.csrftoken,
      },
      body: JSON.stringify({
        action: action, // true = delete, false = keep
      }),
    });
    mutate(data);
  };

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
          <>
            <dialog
              popover="auto"
              id={`review-${val.id}-delete`}
              className="bg-[#00000000] backdrop:bg-text backdrop:opacity-25"
            >
              <Card className="flex w-[300px] flex-col p-md">
                <p>Are you sure you want to delete this review?</p>
                <div className="flex w-full flex-row gap-sm pt-md">
                  <Btn
                    variant="primary"
                    className="!bg-important text-background"
                    popoverTarget={`review-${val.id}-delete`}
                    onClick={async () => handleAction(val.id, true)}
                  >
                    Yes
                  </Btn>
                  <Btn
                    className="bg-background text-primary"
                    variant="primary"
                    popoverTarget={`review-${val.id}-delete`}
                  >
                    No
                  </Btn>
                </div>
              </Card>
            </dialog>

            <dialog
              popover="auto"
              id={`review-${val.id}-keep`}
              className="bg-[#00000000] backdrop:bg-text backdrop:opacity-25"
            >
              <Card className="flex w-[300px] flex-col p-md">
                <p>Are you sure you want to keep this review?</p>
                <div className="flex w-full flex-row gap-sm pt-md">
                  <Btn
                    variant="primary"
                    className="!bg-important text-background"
                    popoverTarget={`review-${val.id}-keep`}
                    onClick={async () => handleAction(val.id, false)}
                  >
                    Yes
                  </Btn>
                  <Btn
                    className="bg-background text-primary"
                    variant="primary"
                    popoverTarget={`review-${val.id}-keep`}
                  >
                    No
                  </Btn>
                </div>
              </Card>
            </dialog>

            <Card
              key={`review${val.id}`}
              className="flex w-full flex-col gap-[20px] p-4 lg:flex-row"
            >
              <Card className="top-24 h-min lg:sticky lg:top-4 lg:w-2/3">
                <Review
                  link={`/professors/${val.professor_id}`}
                  title={val.professor_name}
                  name={
                    val.reviewer_name ??
                    val.reviewer_username ??
                    'Anonymous User'
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
                  isShownInteractions={false}
                  className="border-0"
                />
                <div className="flex w-full flex-row justify-around pb-2">
                  <Btn
                    variant="primary"
                    className="!bg-important text-background"
                    popoverTarget={`review-${val.id}-delete`}
                  >
                    Delete
                  </Btn>
                  <Btn
                    variant="primary"
                    className="bg-background text-primary"
                    popoverTarget={`review-${val.id}-keep`}
                  >
                    Keep
                  </Btn>
                </div>
              </Card>
              <div className="flex w-full flex-row gap-[20px] max-lg:overflow-x-auto lg:w-1/3 lg:flex-col">
                <p className="font-bold text-text">Flags</p>
                {val.flags.map((fval, fidx) => (
                  <Card
                    key={`review${val.id}flag${fidx}`}
                    className="flex flex-shrink-0 flex-col p-4 max-lg:w-[200px]"
                  >
                    <div className="flex flex-col justify-between pb-2 lg:flex-row">
                      <p className="font-bold text-text">{fval.name}</p>
                      <p className="text-small-lg font-bold uppercase text-neutral lg:text-right">
                        {dayjs(fval.created_at).format('MMM D, YYYY')}
                      </p>
                    </div>
                    <p className="text-wrap text-text">{fval.reason}</p>
                  </Card>
                ))}
              </div>
            </Card>
          </>
        ))}
      </div>

      <div className="flex flex-row justify-center">
        <PaginationBar totalPages={data?.pages ?? 0} />
      </div>
    </section>
  );
};
