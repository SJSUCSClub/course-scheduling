import { RoleContext } from '@/app/(main)/admin/check';
import { LinkBtn } from '@/components/atoms';
import { Review } from '@/components/organisms';
import { useContext } from 'react';

export const Dashboard: React.FC = () => {
  const role = useContext(RoleContext);
  //const {data } = useSWR<AdminFlaggedReviewsResponse>("/django/admin/flagged-reviews")

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
        <Review
          link={`/professors/${'TEST'}`}
          title={'TEST'}
          name={'TEST'}
          createdAt={Date.now().toString()}
          updatedAt={Date.now().toString()}
          content={'TEST'}
          quality={5}
          ease={5}
          grade={'A'}
          tags={['TEST']}
          takeAgain={true}
          votes={{ upvotes: 0, downvotes: 0 }}
          userId={'TEST'}
          id={'TEST'}
          userVote={null}
          professorId={'TEST'}
          courseId={'TEST'}
        />
      </div>
    </section>
  );
};
