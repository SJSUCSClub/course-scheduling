import { CoursesSearchResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

const sitemapLinksLimit = 50000;

export async function generateSitemaps() {
  const { total_results } = (await fetcher(
    process.env.BASE_API_URL + `/core/courses/search?`,
  )) as CoursesSearchResponse;
  const numberOfSitemaps = Math.ceil(total_results / sitemapLinksLimit);
  return Array.from({ length: numberOfSitemaps }, (_, i) => ({
    id: i,
  }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const requestParams = new URLSearchParams();
  requestParams.append('limit', sitemapLinksLimit.toString());
  requestParams.append('page', (id + 1).toString());
  const { items } = (await fetcher(
    process.env.BASE_API_URL +
      `/core/courses/search?${requestParams.toString()}`,
  )) as CoursesSearchResponse;
  return items.map((course) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${course.department}-${course.course_number}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
}
