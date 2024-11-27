import { titlingGothicFB } from '@/app/fonts';
import { Card } from '@/components/atoms';
import { DepartmentsResponse } from '@/types/core/departments';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Courses',
};

export default async function Page() {
  const data: DepartmentsResponse = await fetch(
    process.env.BASE_API_URL + '/core/departments',
  ).then((resp) => resp.json());

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const map: Map<string, DepartmentsResponse['departments']> = new Map();
  for (const letter of letters) {
    map.set(letter, []);
  }

  data.departments.forEach(({ abbr_dept, count, name }) =>
    map.get(abbr_dept[0])?.push({ abbr_dept, count, name }),
  );

  const components: {
    letter: string;
    departments: DepartmentsResponse['departments'];
  }[] = [];
  map.forEach((value, key) => {
    if (value.length > 0) {
      components.push({ letter: key, departments: value });
    }
  });

  return (
    <>
      <h1
        className={`pb-md pt-xl ${titlingGothicFB.className} max-lg:text-[1.5rem] lg:text-[2rem]`}
      >
        Department
      </h1>
      <div className="flex flex-col gap-[20px]">
        {components.map(({ letter, departments }) => (
          <Card key={letter} className="flex flex-col gap-[20px] p-[20px]">
            <div className="flex flex-col items-center">
              <span className="text-h3-mobile lg:text-h3-desktop">
                {letter}
              </span>
              <span className="text-text">
                {departments.length} Departments
              </span>
            </div>
            <div className="flex flex-row flex-wrap justify-center gap-[20px]">
              {departments.map((department) => (
                <Card className="items-center" key={department.abbr_dept}>
                  <Link
                    href={`/courses/search?department=${department.abbr_dept}`}
                    className="flex h-full w-[300px] flex-row items-center justify-between px-md py-md animation hover:bg-[rgb(var(--color-secondary)/0.15)] focus:bg-[rgb(var(--color-secondary)/0.15)]"
                  >
                    <div className="flex flex-col pr-4">
                      <span className="text-p font-bold">
                        {department.name}
                      </span>
                      <span className="text-small-lg text-neutral">
                        {department.abbr_dept}
                      </span>
                    </div>
                    <span className="text-right text-small-lg text-neutral">
                      {department.count} Courses
                    </span>
                  </Link>
                </Card>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
