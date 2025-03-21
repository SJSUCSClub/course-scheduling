import { CoursesSearchResponse, ProfessorsSearchResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

const sitemapLinksLimit = 50000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { total_results: totalCourses } = (await fetcher(
    process.env.BASE_API_URL + `/core/courses/search?`,
  )) as CoursesSearchResponse;
  const { total_results: totalProfessors } = (await fetcher(
    process.env.BASE_API_URL + `/core/professors/search?`,
  )) as ProfessorsSearchResponse;
  const numberOfCourseSitemaps = Math.ceil(totalCourses / sitemapLinksLimit);
  const numberOfProfessorSitemaps = Math.ceil(
    totalProfessors / sitemapLinksLimit,
  );
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      lastModified: new Date().toISOString(),
      // changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses`,
      lastModified: new Date().toISOString(),
      // changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/professors`,
      lastModified: new Date().toISOString(),
      // changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/compare`,
      lastModified: new Date().toISOString(),
      // changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy`,
      lastModified: new Date().toISOString(),
      // changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/terms`,
      lastModified: new Date().toISOString(),
      // changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...Array.from({ length: numberOfCourseSitemaps }, (_, i) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/sitemap/${i}.xml`,
      lastModified: new Date().toISOString(),
      // changeFrequency: 'monthly',
      priority: 0.6,
    })),
    ...Array.from({ length: numberOfProfessorSitemaps }, (_, i) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/professors/sitemap/${i}.xml`,
      lastModified: new Date().toISOString(),
      // changeFrequency: 'monthly',
      priority: 0.6,
    })),
  ];
}
