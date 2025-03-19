import { Btn, Card, Select, Tag, Textarea } from '@/components/atoms';
import { FilterGroup, SearchBar } from '@/components/molecules';
import { CoursesSearchResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import { formatName } from '@/utils/format-name';
import { getServerSession } from '@/utils/get-server-session';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { professor_id: string };
}): Promise<Metadata> {
  return {
    title: `Review ${formatName(searchParams.professor_id)}`,
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: {
    review_id: string;
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
  };
}) {
  const session = getServerSession();
  if (!session) {
    redirect(process.env.BASE_API_URL + '/google/authorize');
  }
  const requestParams = new URLSearchParams();
  searchParams.course_query &&
    requestParams.append('query', searchParams.course_query);
  requestParams.append('limit', '10');
  const { items: courses } = (await fetcher(
    process.env.BASE_API_URL +
      `/core/courses/search?${requestParams.toString()}`,
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
            Review{' '}
            {searchParams.professor_id
              .split('.')
              .map((p) => p[0].toUpperCase() + p.slice(1))
              .join(' ')}
          </h1>
          <h2 className="pb-xl text-neutral max-lg:text-h5-mobile lg:text-h5-desktop">
            Share your experience to help fellow students choose the right
            professor.
          </h2>
        </div>
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
        <form
          action="/professors/review/success"
          className="flex flex-col gap-md"
        >
          <Card className="flex flex-col gap-md p-lg">
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
              name="course_number"
              value={
                searchParams.course_id
                  ? searchParams.course_id.split('-')[1]
                  : undefined
              }
            />
            <input
              type="hidden"
              name="department"
              value={
                searchParams.course_id
                  ? searchParams.course_id.split('-')[0]
                  : undefined
              }
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
                name="content"
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
            disabled={!searchParams.course_id}
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
