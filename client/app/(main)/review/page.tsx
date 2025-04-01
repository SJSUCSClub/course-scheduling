import { Btn, Card, LinkBtn, Select, Tag, Textarea } from '@/components/atoms';
import { FilterGroup, SearchBar } from '@/components/molecules';
import { CoursesSearchResponse, ProfessorsSearchResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import { formatName } from '@/utils/format-name';
import { getServerSession } from '@/utils/get-server-session';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

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

export default async function Page({
  searchParams,
}: {
  searchParams: {
    review_id: string;
    professor_query: string;
    course_query: string;
    professor_id: string;
    course_id: string;
    review: string;
    quality: number;
    ease: number;
    grade: string;
    take_again: boolean;
    tags: string[];
    is_user_anonymous: boolean;
    submit: boolean;
  };
}) {
  const session = getServerSession();
  if (!session) {
    redirect(process.env.BASE_API_URL + '/google/authorize');
  }

  // Review Submitted
  if (searchParams.submit) {
    const body = {
      professor_id: searchParams.professor_id,
      course_number: searchParams.course_id
        ? searchParams.course_id.split('-')[1]
        : undefined,
      department: searchParams.course_id
        ? searchParams.course_id.split('-')[0]
        : undefined,
      content: searchParams.review,
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
              <div className="flex min-w-min flex-wrap justify-center gap-md pb-xl">
                <LinkBtn variant="ghost" href="/profile">
                  Go to Profile
                  <ChevronRightIcon width={20} height={20} />
                </LinkBtn>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Fetch professors
  const professorsRequestParams = new URLSearchParams();
  searchParams.professor_query &&
    professorsRequestParams.append('query', searchParams.professor_query);
  professorsRequestParams.append('limit', '10');
  const { items: professors } = (await fetcher(
    process.env.BASE_API_URL +
      `/core/professors/search?${professorsRequestParams.toString()}`,
  )) as ProfessorsSearchResponse;
  const unselectedProfessors =
    professors.map((professor) => professor.id) ?? [];
  const professorsValues = Array.from(
    new Set(
      searchParams.professor_id
        ? [searchParams.professor_id, ...unselectedProfessors]
        : unselectedProfessors,
    ),
  );

  // Fetch courses
  const coursesRequestParams = new URLSearchParams();
  searchParams.course_query &&
    coursesRequestParams.append('query', searchParams.course_query);
  coursesRequestParams.append('limit', '10');
  const { items: courses } = (await fetcher(
    process.env.BASE_API_URL +
      `/core/courses/search?${coursesRequestParams.toString()}`,
  )) as CoursesSearchResponse;
  const unselectedCourses =
    courses.map((course) => `${course.department}-${course.course_number}`) ??
    [];
  const coursesValues = Array.from(
    new Set(
      searchParams.course_id
        ? [searchParams.course_id, ...unselectedCourses]
        : unselectedCourses,
    ),
  );

  return (
    <main>
      <section className="mx-auto w-full max-w-content-width px-md pb-lg pt-xxl">
        <div>
          <h1 className="pb-xs max-lg:text-h3-mobile lg:text-h3-desktop">
            Write a Review
          </h1>
          <h2 className="pb-xl text-neutral max-lg:text-h5-mobile lg:text-h5-desktop">
            Share your experience to help fellow students choose the right
            professor.
          </h2>
        </div>
        <Card className="mb-lg p-lg">
          <label>
            <p className="pb-sm">
              Pick a Professor<span className="pl-xs text-important">*</span>
            </p>
            <div className="pb-lg">
              <SearchBar
                param="professor_query"
                shouldResetPageOnChange={false}
              />
            </div>
            {professorsValues.length ? (
              <FilterGroup
                variant="radio"
                param="professor_id"
                values={professorsValues}
                shouldResetPageOnChange={false}
              />
            ) : (
              <p className="text-neutral">No professors found</p>
            )}
          </label>
        </Card>
        <Card className="mb-lg p-lg">
          <label>
            <p className="pb-sm">
              Pick a Course<span className="pl-xs text-important">*</span>
            </p>
            <div className="pb-lg">
              <SearchBar param="course_query" shouldResetPageOnChange={false} />
            </div>
            {coursesValues.length ? (
              <FilterGroup
                variant="radio"
                param="course_id"
                values={coursesValues}
                shouldResetPageOnChange={false}
              />
            ) : (
              <p className="text-neutral">No courses found</p>
            )}
          </label>
        </Card>
        <form action="/review" className="flex flex-col gap-md">
          <Card className="flex flex-col gap-md p-lg">
            <input type="hidden" name="submit" value="true" />
            <input
              type="hidden"
              name="review_id"
              value={searchParams.review_id}
            />
            <input
              type="hidden"
              name="professor_id"
              value={searchParams.professor_id}
            />
            <input
              type="hidden"
              name="course_id"
              value={searchParams.course_id}
            />
            <label className="pb-md">
              <p className="pb-sm">
                Ease<span className="pl-xs text-important">*</span>
              </p>
              <input
                type="range"
                name="ease"
                min="1"
                max="5"
                list="ease-values"
                className="w-full"
                defaultValue={searchParams.ease ?? 3}
                required
              />
              <datalist className="flex justify-between" id="ease-values">
                <option value="1" label="1" />
                <option value="2" label="2" />
                <option value="3" label="3" />
                <option value="4" label="4" />
                <option value="5" label="5" />
              </datalist>
            </label>
            <label className="pb-md">
              <p className="pb-sm">
                Quality<span className="pl-xs text-important">*</span>
              </p>
              <input
                type="range"
                name="quality"
                min="1"
                max="5"
                list="quality-values"
                className="w-full"
                defaultValue={searchParams.quality ?? 3}
                required
              />
              <datalist className="flex justify-between" id="quality-values">
                <option value="1" label="1" />
                <option value="2" label="2" />
                <option value="3" label="3" />
                <option value="4" label="4" />
                <option value="5" label="5" />
              </datalist>
            </label>
            <label className="pb-md">
              <p className="pb-md">
                Would you take this professor again?
                <span className="pl-xs text-important">*</span>
              </p>
              <div className="flex w-full gap-sm">
                <Tag
                  required
                  name="take_again"
                  value="true"
                  type="radio"
                  defaultChecked={
                    searchParams.take_again === true ? true : false
                  }
                >
                  Yes
                </Tag>
                <Tag
                  required
                  name="take_again"
                  value="false"
                  type="radio"
                  defaultChecked={
                    searchParams.take_again === false ? true : false
                  }
                >
                  No
                </Tag>
              </div>
            </label>
            <label className="pb-md">
              <p className="pb-sm">Grade</p>
              <Select
                name="grade"
                className="w-full"
                defaultValue={searchParams.grade ?? ''}
              >
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D+">D+</option>
                <option value="D">D</option>
                <option value="D-">D-</option>
                <option value="F">F</option>
              </Select>
            </label>
            <label className="pb-md">
              <p className="pb-md">Tags</p>
              <div className="flex w-full flex-wrap gap-sm">
                {[
                  'Tough grader',
                  'Get ready to read',
                  'Participation matters',
                  'Extra credit',
                  'Group projects',
                  'Amazing lectures',
                  'Clear grading criteria',
                  'Gives good feedback',
                  'Inspirational',
                  'Lots of homework',
                  'Hilarious',
                  'Beware of pop quizzes',
                  'So many papers',
                  'Caring',
                  'Respected',
                  'Lecture heavy',
                  'Test heavy',
                  'Graded by few things',
                  'Accessible outside class',
                  'Online savvy',
                ].map((tag) => (
                  <Tag
                    key={tag}
                    name="tags"
                    value={tag}
                    type="checkbox"
                    defaultChecked={
                      searchParams.tags
                        ? Array.isArray(searchParams.tags)
                          ? searchParams.tags?.includes(tag)
                          : searchParams.tags === tag
                        : false
                    }
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </label>
            <label className="pb-md">
              <p className="pb-xs">
                Write a Review<span className="pl-xs text-important">*</span>
              </p>
              <p className="pb-sm text-small-lg">
                Share your experience with this professor&apos;s
                professionalism, teaching methods, clarity, and overall
                helpfulness.{' '}
                <span className="text-important">
                  Please avoid using profanity or derogatory language.
                </span>
              </p>
              <Textarea
                minLength={40}
                name="review"
                className="w-full"
                defaultValue={searchParams.review}
                required
              />
            </label>
            <label>
              <p className="pb-md">
                Would you like this review to be anonymous?
                <span className="pl-xs text-important">*</span>
              </p>
              <div className="flex w-full gap-sm">
                <Tag
                  required
                  name="is_user_anonymous"
                  value="false"
                  type="radio"
                  defaultChecked={
                    searchParams.is_user_anonymous
                      ? !searchParams.is_user_anonymous
                      : false
                  }
                >
                  No
                </Tag>
                <Tag
                  required
                  name="is_user_anonymous"
                  value="true"
                  type="radio"
                  defaultChecked={
                    searchParams.is_user_anonymous
                      ? searchParams.is_user_anonymous
                      : false
                  }
                >
                  Yes
                </Tag>
              </div>
            </label>
          </Card>
          <Btn
            disabled={!searchParams.course_id || !searchParams.professor_id}
            variant="primary"
            type="submit"
            className="justify-center text-center"
          >
            Submit Review
          </Btn>
        </form>
      </section>
    </main>
  );
}
