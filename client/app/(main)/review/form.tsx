'use client';

import { Btn, Card, LinkBtn, Select, Tag, Textarea } from '@/components/atoms';
import { FilterGroup, SearchBar } from '@/components/molecules';
import { CoursesSearchResponse, ProfessorsSearchResponse } from '@/types';
import fetcher, { FetchError } from '@/utils/fetcher';
import SWRConfigProvider from '@/wrappers/swr-config';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';
import useSWR from 'swr';

function groupByKey<T>(entries: [string, T][]): Record<string, T | T[]> {
  return entries.reduce<Record<string, T | T[]>>((acc, [key, value]) => {
    if (acc[key] === undefined) {
      acc[key] = value;
    } else if (!(acc[key] instanceof Array)) {
      acc[key] = [acc[key] as T, value];
    }
    // If we've already converted it to an array, just push the new value
    else {
      (acc[key] as T[]).push(value);
    }
    return acc;
  }, {});
}

export const FormWithProviders: React.FC = () => {
  return (
    <SWRConfigProvider>
      <CookiesProvider>
        <Form />
      </CookiesProvider>
    </SWRConfigProvider>
  );
};

const Form: React.FC = () => {
  const searchParams = useSearchParams();

  // Fetch professors and courses based on search parameters
  const professorsRequestParams = new URLSearchParams();
  const professorQuery = searchParams.get('professorQuery');
  professorQuery && professorsRequestParams.append('query', professorQuery);
  professorsRequestParams.append('limit', '10');
  const { data: professors } = useSWR<ProfessorsSearchResponse, Error>(
    `/api/core/professors/search?${professorsRequestParams.toString()}`,
  );
  const unselectedProfessors =
    professors?.items.map((professor) => professor.id) ?? [];
  const professorId = searchParams.get('professor_id');
  const professorsValues = Array.from(
    new Set(
      professorId
        ? [professorId, ...unselectedProfessors]
        : unselectedProfessors,
    ),
  );

  // Fetch courses based on search parameters
  const coursesRequestParams = new URLSearchParams();
  const courseQuery = searchParams.get('courseQuery');
  courseQuery && coursesRequestParams.append('query', courseQuery);
  coursesRequestParams.append('limit', '10');
  const { data: courses } = useSWR<CoursesSearchResponse, Error>(
    `/api/core/courses/search?${coursesRequestParams.toString()}`,
  );
  const unselectedCourses =
    courses?.items.map(
      (course) => `${course.department}-${course.course_number}`,
    ) ?? [];
  const courseId = searchParams.get('course_id');
  const coursesValues = Array.from(
    new Set(courseId ? [courseId, ...unselectedCourses] : unselectedCourses),
  );

  // Selected tags
  const selectedTags = searchParams.getAll('tags');

  // Form submission inputs for course information
  const courseDepartment = courseId ? courseId.split('-')[0] : '';
  const courseNumber = courseId ? courseId.split('-')[1] : '';

  // Form submission
  const [cookies] = useCookies(['csrftoken']);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const data = groupByKey<FormDataEntryValue>(
        Array.from(formData.entries()),
      );
      await fetcher(
        `/api/core/users/reviews${searchParams.get('review_id') ? '/' + searchParams.get('review_id') : ''}`,
        {
          method: searchParams.get('review_id') ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.csrftoken ?? '',
            Referer: process.env.NEXT_PUBLIC_BASE_URL || '',
          },
          body: JSON.stringify(data),
        },
      );
      setSuccess(true);
    } catch (error) {
      if (error instanceof FetchError) {
        setError(error.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  if (success)
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <p className="text-lg max-w-[400px] text-center font-semibold">
          Thank you for reviewing Professor{' '}
          <Link
            className="w-fit rounded-sm text-text underline hover:text-secondary"
            href={`/professors/${professorId}`}
          >
            {professorId
              ?.split('.')
              .map((p) => p[0].toUpperCase() + p.slice(1))
              .join(' ')}
          </Link>
          ! We appreciate your feedback.
        </p>
        <LinkBtn className="mt-4" variant="primary" href="/profile">
          Go to Profile
          <ChevronRightIcon width={20} height={20} />
        </LinkBtn>
      </div>
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
                param="professorQuery"
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
              <SearchBar param="courseQuery" shouldResetPageOnChange={false} />
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <Card className="flex flex-col gap-md p-lg">
            <input type="hidden" name="submit" value="true" />
            <input
              type="hidden"
              name="professor_id"
              value={searchParams.get('professor_id') ?? ''}
            />
            <input type="hidden" name="course_number" value={courseNumber} />
            <input type="hidden" name="department" value={courseDepartment} />
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
                defaultValue={searchParams.get('ease') ?? 3}
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
                defaultValue={searchParams.get('quality') ?? 3}
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
                    searchParams.get('take_again') === 'true' ? true : false
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
                    searchParams.get('take_again') === 'false' ? true : false
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
                defaultValue={searchParams.get('grade') ?? ''}
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
                    defaultChecked={selectedTags.includes(tag)}
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
                defaultValue={searchParams.get('review') ?? ''}
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
                    searchParams.get('is_user_anonymous')
                      ? !searchParams.get('is_user_anonymous')
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
                    searchParams.get('is_user_anonymous')
                      ? !!searchParams.get('is_user_anonymous')
                      : false
                  }
                >
                  Yes
                </Tag>
              </div>
            </label>
          </Card>
          <Btn
            disabled={!courseId || !professorId}
            variant="primary"
            type="submit"
            className="justify-center text-center"
          >
            Submit Review
          </Btn>
          {error && (
            <p className="w-full text-center text-important">{error}</p>
          )}
        </form>
      </section>
    </main>
  );
};
