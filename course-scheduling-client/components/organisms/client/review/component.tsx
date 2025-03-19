'use client';

import { Btn, Card, LinkBtn, Spinner, Tag, Textarea } from '@/components/atoms';
import { SessionType } from '@/types';
import { ReviewsIDCommentsResponse } from '@/types/core/reviews';
import { cn } from '@/utils/cn';
import getEvaluation from '@/utils/get-evaluation';
import SessionProvider, { useSession } from '@/wrappers/session-provider';
import SWRConfigProvider from '@/wrappers/swr-config';
import {
  ChatBubbleOvalLeftIcon,
  FlagIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import {
  ChatBubbleOvalLeftIcon as ChatBubbleOvalLeftIconSolid,
  ChevronRightIcon,
  HandThumbDownIcon as HandThumbDownIconSolid,
  HandThumbUpIcon as HandThumbUpIconSolid,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';

interface Props {
  link: string;
  userId: string | null;
  id: string;
  createdAt: string | null;
  updatedAt: string | null;
  name: string;
  courseId: string;
  professorId: string | null;
  title: string;
  content: string;
  quality: number;
  ease: number;
  grade: string | null;
  tags: string[];
  takeAgain: boolean | null;
  userVote: boolean | null;
  votes: {
    upvotes: number;
    downvotes: number;
  };
  isShownInteractions?: boolean;
  className?: string;
}

export const Review: React.FC<Props> = (props) => (
  <SWRConfigProvider>
    <SessionProvider>
      <ReviewWithoutProviders {...props} />
    </SessionProvider>
  </SWRConfigProvider>
);

interface CommentProps {
  // comment props
  comment: {
    id: number;
    review_id: number;
    user_id: string | null;
    created_at: string;
    updated_at: string | null;
    content: string;
  };
  // and additional knowledge
  isAuthenticated: boolean;
  session: SessionType | null;
  userId: string | null;
  handleDeleteComment: (commentId: number) => void;
}
const CommentWithoutProviders: React.FC<CommentProps> = ({
  comment,
  handleDeleteComment,
  ...props
}) => {
  const [hasFlagged, setHasFlagged] = React.useState(false);
  const [error, setError] = React.useState(false);
  const router = useRouter();
  const [cookies] = useCookies(['csrftoken']);

  const handleReportComment = (e: React.FormEvent<HTMLFormElement>) => {
    if (!props.isAuthenticated) {
      router.push('/django/google/authorize');
      return;
    }
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reason = formData.get('reason') as string;
    const body = {
      comment_id: comment.id,
      reason,
    };
    fetch(`/django/core/users/flagged_comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.csrftoken,
      },
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) {
        setError(true); // TODO - show error; current logic doesn't work
      }
      setHasFlagged(true);
    });
  };

  return (
    <>
      <div className="flex items-center gap-sm px-md pb-md">
        <div className="flex-1">
          <p>
            <span className="font-bold">{comment.user_id}</span>{' '}
            <span className="text-neutral">
              {comment.updated_at
                ? `updated on ${dayjs(comment.updated_at).format('MMMM D, YYYY')}`
                : `commented on ${dayjs(comment.created_at).format('MMMM D, YYYY')}`}
            </span>
          </p>
          <p>{comment.content}</p>
        </div>

        {props.userId == comment.user_id ? (
          <div>
            <Btn
              className="gap-sm rounded-sm p-0"
              variant="tertiary"
              onClick={() => handleDeleteComment(comment.id)}
            >
              <TrashIcon width={24} height={24} />
            </Btn>
          </div>
        ) : null}
        <Btn
          className="gap-sm rounded-sm p-0"
          variant="tertiary"
          popoverTarget={`report-review-${comment.id}`}
        >
          <FlagIcon width={24} height={24} />
        </Btn>

        <dialog
          popover="auto"
          id={`report-review-${comment.id}`}
          className="bg-[#00000000] backdrop:bg-text backdrop:opacity-25"
          onClose={() => setHasFlagged(false)}
        >
          <Card className="w-[300px] p-md">
            {!hasFlagged ? (
              <>
                <p className="pb-md font-bold">Reason:</p>
                <form onSubmit={handleReportComment}>
                  <Textarea
                    required
                    minLength={10}
                    className="w-full"
                    placeholder="Please provide a reason..."
                    name="reason"
                  />
                  <div className="flex w-full gap-sm pt-md">
                    <Btn
                      className="!bg-important text-background"
                      variant="primary"
                      type="submit"
                      popoverTarget={`report-review-${comment.id}`}
                    >
                      Report
                    </Btn>
                    <Btn
                      className="bg-background text-primary"
                      variant="primary"
                      type="button"
                      popoverTarget={`report-review-${comment.id}`}
                    >
                      Cancel
                    </Btn>
                  </div>
                </form>
                {error ? (
                  <p className="pt-md text-important">
                    There was an error making your request.
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <p className="pb-md text-center">
                  Thank you for providing your feedback. We will review this
                  report.
                </p>
                <div className="flex w-full justify-center">
                  <Btn
                    className="w-min"
                    variant="primary"
                    popoverTarget={`report-review-${comment.id}`}
                  >
                    Close
                  </Btn>
                </div>
              </>
            )}
          </Card>
        </dialog>
      </div>
    </>
  );
};

interface CommentsProps {
  reviewId: string;
  userId: string | null;
  isAuthenticated: boolean;
  session: SessionType | null;
}

const CommentsWithoutProviders: React.FC<CommentsProps> = (props) => {
  const { data, error, isLoading, isValidating, mutate } =
    useSWR<ReviewsIDCommentsResponse>(
      `/django/core/reviews/${props.reviewId}/comments`,
    );
  const [cookies] = useCookies(['csrftoken']);
  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const comment = formData.get('comment') as string;
    if (!comment) return;
    const newComment = {
      id: 0,
      user_id: props.userId,
      review_id: parseInt(props.reviewId),
      created_at: new Date().toISOString(),
      updated_at: null,
      content: comment,
    };
    const newData = data ? [...data, newComment] : [newComment];
    mutate(
      async () => {
        await fetch(`/django/core/users/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.csrftoken,
          },
          body: JSON.stringify({
            review_id: props.reviewId,
            content: comment,
          }),
        });
        return newData;
      },
      {
        optimisticData: newData,
      },
    );
    // Reset form
    e.currentTarget.reset();
  };
  const handleDeleteComment = (comment_id: number) => {
    const newData = data
      ? data.filter((comment) => comment.id !== comment_id)
      : [];
    const requestParams = new URLSearchParams();
    requestParams.set('review_id', props.reviewId);
    requestParams.set('comment_id', comment_id.toString());
    mutate(
      async () => {
        await fetch(
          `/django/core/users/reviews/comments?${requestParams.toString()}`,
          {
            method: 'DELETE',
            headers: {
              'X-CSRFToken': cookies.csrftoken,
            },
          },
        );
        return newData;
      },
      {
        optimisticData: newData,
      },
    );
  };
  return (
    <>
      {data ? (
        data.length ? (
          <div className="px-sm pt-md">
            {data.map((comment, i) => (
              <div className="flex flex-col gap-md" key={i}>
                {i > 0 ? <hr /> : null}
                <CommentWithoutProviders
                  comment={comment}
                  userId={props.userId}
                  isAuthenticated={props.isAuthenticated}
                  session={props.session}
                  handleDeleteComment={handleDeleteComment}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="px-sm py-md text-center">No comments yet.</p>
        )
      ) : null}
      {error ? (
        <p className="px-sm py-md text-center text-important">
          There was an error loading comments.
        </p>
      ) : null}
      {isLoading || isValidating ? (
        <Spinner className="flex w-full justify-center pb-lg" />
      ) : null}
      {props.isAuthenticated ? (
        <form className="flex gap-sm pt-sm" onSubmit={handleAddComment}>
          <Textarea
            className="w-full"
            placeholder="Add your comment here..."
            name="comment"
          />
          <Btn
            disabled={isLoading || isValidating}
            className="rounded-md bg-background p-lg text-primary"
            variant="primary"
            type="submit"
          >
            <ChevronRightIcon width={24} height={24} />
          </Btn>
        </form>
      ) : (
        <span className="flex w-full items-center justify-center py-md">
          <LinkBtn
            variant="tertiary"
            className="w-fit px-sm"
            href="/django/google/authorize"
          >
            Log in
          </LinkBtn>{' '}
          to add a comment.
        </span>
      )}
    </>
  );
};

export const ReviewWithoutProviders: React.FC<Props> = ({
  isShownInteractions = true,
  className = '',
  ...props
}) => {
  const session = useSession();
  const isAuthenticated = session !== null;
  const userId = session?.email.split('@')[0] ?? null;
  const router = useRouter();
  const isOwner =
    isAuthenticated && props.userId !== null && userId === props.userId;
  const [isShownComments, setIsShownComments] = React.useState(false);
  const toggleComments = () => setIsShownComments(!isShownComments);
  const [isUpvoted, setIsUpvoted] = React.useState(
    props.userVote === true ? true : false,
  );
  const [isDownvoted, setIsDownvoted] = React.useState(
    props.userVote === false ? true : false,
  );
  const [hasFlagged, setHasFlagged] = React.useState(false);
  const [error, setError] = React.useState(false);
  let quality = props.quality;
  if (typeof props.quality !== 'number') quality = parseInt(props.quality);
  let ease = props.ease;
  if (typeof props.ease !== 'number') ease = parseInt(props.ease);
  const rating = Math.round(((quality + ease) / 2) * 10) / 10;
  const upvotes =
    props.userVote === true ? props.votes.upvotes - 1 : props.votes.upvotes;
  const downvotes =
    props.userVote === false
      ? props.votes.downvotes - 1
      : props.votes.downvotes;
  const [cookies] = useCookies(['csrftoken']);
  const handleUpvote = () => {
    if (!isAuthenticated) {
      router.push('/django/google/authorize');
      return;
    }
    setIsUpvoted(!isUpvoted);
    setIsDownvoted(false);
  };
  const handleDownvote = () => {
    if (!isAuthenticated) {
      router.push('/django/google/authorize');
      return;
    }
    setIsDownvoted(!isDownvoted);
    setIsUpvoted(false);
  };
  React.useEffect(() => {
    if (!isAuthenticated) return;
    fetch(`/django/core/users/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.csrftoken,
      },
      body: JSON.stringify({
        review_id: props.id,
        vote: isUpvoted ? true : isDownvoted ? false : null,
      }),
    }).then((res) => {
      if (!res.ok) {
        setError(true);
      }
    });
  }, [isUpvoted, isDownvoted, cookies.csrftoken, props.id, isAuthenticated]);
  const handleDelete = () => {
    fetch(`/django/core/users/reviews/${props.id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': cookies.csrftoken,
      },
    }).then((res) => {
      if (!res.ok) {
        setError(true);
      }
      location.reload();
    });
  };
  const handleReport = (e: React.FormEvent<HTMLFormElement>) => {
    if (!isAuthenticated) {
      router.push('/django/google/authorize');
      return;
    }
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reason = formData.get('reason') as string;
    const body = {
      review_id: props.id,
      reason,
    };
    fetch(`/django/core/users/flagged_reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': cookies.csrftoken,
      },
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) {
        setError(true);
      }
      setHasFlagged(true);
    });
  };

  const editParams = new URLSearchParams();
  editParams.set('review_id', props.id);
  editParams.set('professor_id', props.professorId ?? '');
  editParams.set('course_id', props.courseId);
  editParams.set('review', props.content);
  editParams.set('quality', quality.toString());
  editParams.set('ease', ease.toString());
  editParams.set('grade', props.grade ?? '');
  editParams.set('take_again', props.takeAgain?.toString() ?? '');
  if (Array.isArray(props.tags)) {
    props.tags.forEach((tag) => {
      editParams.append('tags', tag);
    });
  } else if (props.tags) {
    editParams.append('tags', props.tags);
  }
  editParams.set('is_user_anonymous', props.userId === null ? 'true' : 'false');

  return (
    <Card className={cn('p-sm', className)}>
      <div className="flex gap-xl max-lg:flex-col">
        <div className="flex-1 p-md">
          <div>
            {/* Heading */}
            <div className="pb-md">
              <div className="flex items-center justify-between gap-md">
                <LinkBtn
                  className="rounded-sm p-0 text-inherit underline hover:text-secondary"
                  variant="tertiary"
                  href={props.link}
                >
                  {props.title}
                </LinkBtn>
                <p className="text-right text-small-lg font-bold uppercase text-neutral">
                  {props.updatedAt ? 'Edited ' : null}
                  {props.updatedAt
                    ? dayjs(props.updatedAt).format('MMM D, YYYY')
                    : props.createdAt
                      ? dayjs(props.createdAt).format('MMM D, YYYY')
                      : '--- -, ----'}
                </p>
              </div>
              <p className="text-small-sm text-neutral">{props.name}</p>
            </div>

            {/* Ratings */}
            <div className="flex w-full flex-col gap-sm pb-sm">
              <div className="flex w-full flex-col gap-xs">
                <div className="flex w-full items-center justify-between gap-md">
                  <p>Quality</p>
                  <p className="font-bold">{props.quality}</p>
                </div>
                <div className="h-xs w-full rounded-sm bg-border">
                  <div
                    className={cn('h-full rounded-sm', {
                      'bg-good':
                        getEvaluation(props.quality, 'rating') === 'good',
                      'bg-ok': getEvaluation(props.quality, 'rating') === 'ok',
                      'bg-bad':
                        getEvaluation(props.quality, 'rating') === 'bad',
                    })}
                    style={{
                      width: `${props.quality * 20}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-sm pb-md">
              <div className="flex w-full flex-col gap-xs">
                <div className="flex w-full items-center justify-between gap-md">
                  <p>Ease</p>
                  <p className="font-bold">{props.ease}</p>
                </div>
                <div className="h-xs w-full rounded-sm bg-border">
                  <div
                    className={cn('h-full rounded-sm', {
                      'bg-good': getEvaluation(props.ease, 'rating') === 'good',
                      'bg-ok': getEvaluation(props.ease, 'rating') === 'ok',
                      'bg-bad': getEvaluation(props.ease, 'rating') === 'bad',
                    })}
                    style={{
                      width: `${props.ease * 20}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Grade and Take Again */}
            <div className="flex flex-wrap items-center gap-sm pb-md">
              <p>
                Grade:{' '}
                {props.grade ? (
                  <span
                    className={cn('font-bold', {
                      'text-good':
                        getEvaluation(props.grade, 'grade') === 'good',
                      'text-ok': getEvaluation(props.grade, 'grade') === 'ok',
                      'text-bad': getEvaluation(props.grade, 'grade') === 'bad',
                    })}
                  >
                    {props.grade}
                  </span>
                ) : (
                  '-'
                )}
              </p>
              <p className="text-neutral">•</p>
              <p>
                Take again:{' '}
                {props.takeAgain === true || props.takeAgain === false ? (
                  <span
                    className={cn('font-bold', {
                      'text-good': props.takeAgain,
                      'text-bad': !props.takeAgain,
                    })}
                  >
                    {props.takeAgain ? 'Yes' : 'No'}
                  </span>
                ) : (
                  '-'
                )}
              </p>
            </div>

            {/* Break */}
            <hr className="pb-md" />

            {/* Content */}
            <p className="hyphens-auto pb-lg [overflow-wrap:anywhere]">
              {props.content}
            </p>

            {/* Tags */}
            {props.tags.length > 0 && !props.tags.every((tag) => tag === '') ? (
              <div
                className={cn('flex min-w-min flex-wrap gap-md text-neutral', {
                  'pb-lg': isShownInteractions,
                })}
              >
                {props.tags.map((tag, i) => (
                  <Tag
                    key={i}
                    disabled
                    className="cursor-default whitespace-nowrap"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            ) : null}
          </div>

          {/* Interactions */}
          {isShownInteractions ? (
            <div className="flex items-center justify-between gap-md">
              <div className="flex gap-sm">
                <Btn
                  className="gap-sm rounded-sm p-0"
                  variant="tertiary"
                  onClick={handleUpvote}
                >
                  {isUpvoted ? (
                    <HandThumbUpIconSolid width={24} height={24} />
                  ) : (
                    <HandThumbUpIcon width={24} height={24} />
                  )}
                  {isUpvoted ? upvotes + 1 : upvotes}
                </Btn>
                <Btn
                  className="gap-sm rounded-sm p-0"
                  variant="tertiary"
                  onClick={handleDownvote}
                >
                  {isDownvoted ? (
                    <HandThumbDownIconSolid width={24} height={24} />
                  ) : (
                    <HandThumbDownIcon width={24} height={24} />
                  )}
                  {isDownvoted ? downvotes + 1 : downvotes}
                </Btn>
              </div>
              <div className="flex gap-sm">
                {isOwner ? (
                  <>
                    <LinkBtn
                      className="gap-sm rounded-sm p-0"
                      variant="tertiary"
                      href={`/professors/review?${editParams.toString()}`}
                    >
                      <PencilIcon width={24} height={24} />
                    </LinkBtn>
                    <Btn
                      className="gap-sm rounded-sm p-0"
                      variant="tertiary"
                      popoverTarget={`delete-review-${props.id}`}
                    >
                      <TrashIcon width={24} height={24} />
                    </Btn>
                    <dialog
                      popover="auto"
                      id={`delete-review-${props.id}`}
                      className="bg-[#00000000] backdrop:bg-text backdrop:opacity-25"
                    >
                      <Card className="w-min p-md">
                        <p className="pb-sm font-bold">Delete Review</p>
                        <p>Are you sure you want to delete this review?</p>
                        <div className="flex w-full gap-sm pt-md">
                          <Btn
                            className="!bg-important text-background"
                            variant="primary"
                            onClick={handleDelete}
                            popoverTarget={`delete-review-${props.id}`}
                          >
                            Delete
                          </Btn>
                          <Btn
                            className="bg-background text-primary"
                            variant="primary"
                            popoverTarget={`delete-review-${props.id}`}
                          >
                            Cancel
                          </Btn>
                        </div>
                      </Card>
                    </dialog>
                  </>
                ) : null}
                <Btn
                  className="gap-sm rounded-sm p-0"
                  variant="tertiary"
                  onClick={toggleComments}
                >
                  {isShownComments ? (
                    <ChatBubbleOvalLeftIconSolid width={24} height={24} />
                  ) : (
                    <ChatBubbleOvalLeftIcon width={24} height={24} />
                  )}
                </Btn>
                <Btn
                  className="gap-sm rounded-sm p-0"
                  variant="tertiary"
                  popoverTarget={`report-review-${props.id}`}
                >
                  <FlagIcon width={24} height={24} />
                </Btn>
                <dialog
                  popover="auto"
                  id={`report-review-${props.id}`}
                  className="bg-[#00000000] backdrop:bg-text backdrop:opacity-25"
                  onClose={() => setHasFlagged(false)}
                >
                  <Card className="w-[300px] p-md">
                    {!hasFlagged ? (
                      <>
                        <p className="pb-md font-bold">Reason:</p>
                        <form onSubmit={handleReport}>
                          <Textarea
                            required
                            minLength={10}
                            className="w-full"
                            placeholder="Please provide a reason..."
                            name="reason"
                          />
                          <div className="flex w-full gap-sm pt-md">
                            <Btn
                              className="!bg-important text-background"
                              variant="primary"
                              type="submit"
                              popoverTarget={`report-review-${props.id}`}
                            >
                              Report
                            </Btn>
                            <Btn
                              className="bg-background text-primary"
                              variant="primary"
                              type="button"
                              popoverTarget={`report-review-${props.id}`}
                            >
                              Cancel
                            </Btn>
                          </div>
                        </form>
                        {error ? (
                          <p className="pt-md text-important">
                            There was an error making your request.
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <p className="pb-md text-center">
                          Thank you for providing your feedback. We will review
                          this report.
                        </p>
                        <div className="flex w-full justify-center">
                          <Btn
                            className="w-min"
                            variant="primary"
                            popoverTarget={`report-review-${props.id}`}
                          >
                            Close
                          </Btn>
                        </div>
                      </>
                    )}
                  </Card>
                </dialog>
              </div>
            </div>
          ) : null}
        </div>
        <div
          className={cn(
            'flex flex-col items-center justify-center rounded-md bg-border max-lg:p-lg lg:min-w-[200px] lg:p-xxl',
            {
              'text-good': getEvaluation(rating) === 'good',
              'text-ok': getEvaluation(rating) === 'ok',
              'text-bad': getEvaluation(rating) === 'bad',
              'text-neutral': props.id === '0',
            },
          )}
        >
          <p className="!font-bold max-lg:text-small-sm lg:text-small-lg">
            OVERALL
          </p>
          <p className="!font-extrabold max-lg:text-h1-mobile-lg lg:text-h1-desktop-lg">
            {props.id === '0' ? '-' : rating}
          </p>
        </div>
      </div>
      {isShownComments ? (
        <CommentsWithoutProviders
          reviewId={props.id}
          userId={userId}
          isAuthenticated={isAuthenticated}
          session={session}
        />
      ) : null}
      {error ? (
        <p className="w-full p-md text-center text-important">
          There was an error making your request.
        </p>
      ) : null}
    </Card>
  );
};
