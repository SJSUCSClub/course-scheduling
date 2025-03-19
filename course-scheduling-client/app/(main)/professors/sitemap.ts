import { ProfessorsSearchResponse } from '@/types';
import fetcher from '@/utils/fetcher';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

const sitemapLinksLimit = 50000;

export async function generateSitemaps() {
  const { total_results } = (await fetcher(
    process.env.BASE_API_URL + `/core/professors/search?`,
  )) as ProfessorsSearchResponse;
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
      `/core/professors/search?${requestParams.toString()}`,
  )) as ProfessorsSearchResponse;
  return items.map((professor) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/professors/${professor.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
}
