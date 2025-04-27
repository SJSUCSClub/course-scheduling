import { LinkBtn } from '@/components/atoms';
import { formatName } from '@/utils/format-name';
import { getServerSession } from '@/utils/get-server-session';
import { Metadata } from 'next';
import { FormWithProviders } from './form';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { professor_id: string; course_id: string };
}): Promise<Metadata> {
  return {
    title: searchParams.professor_id
      ? `Review ${formatName(searchParams.professor_id)}`
      : searchParams.course_id
        ? `Review ${searchParams.course_id}`
        : 'Write a Review',
  };
}

export default function Page() {
  const session = getServerSession();
  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="text-lg text-center font-semibold">
          Please log in to write a review
        </p>
        <LinkBtn
          className="mt-4"
          variant="primary"
          href="/api/google/authorize"
        >
          Log in with Google
        </LinkBtn>
      </div>
    );
  }

  return <FormWithProviders />;
}
