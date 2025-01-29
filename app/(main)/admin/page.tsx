import { Review } from '@/components/organisms';

export default function Page() {
  return (
    <main>
      <section className="mx-auto w-full max-w-content-width px-md pb-lg pt-xxl">
        <div>
          <h1 className="pb-xs max-lg:text-h3-mobile lg:text-h3-desktop">
            Admin Dashboard
          </h1>
          <h2 className="pb-xl text-neutral max-lg:text-h5-mobile lg:text-h5-desktop">
            Review user reports and moderate content.
          </h2>
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
    </main>
  );
}
