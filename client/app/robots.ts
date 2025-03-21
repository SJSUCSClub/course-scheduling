import type { MetadataRoute } from 'next';
import { generateSitemaps as generateCoursesSitemaps } from '@/app/(main)/courses/sitemap';
import { generateSitemaps as generateProfessorsSitemaps } from '@/app/(main)/professors/sitemap';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const coursesSitemaps = (await generateCoursesSitemaps()).map(
    (_, index) => `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${index}.xml`,
  );
  const professorsSitemaps = (await generateProfessorsSitemaps()).map(
    (_, index) => `${process.env.NEXT_PUBLIC_BASE_URL}/professors/${index}.xml`,
  );
  const bridgeSitemaps = coursesSitemaps.concat(professorsSitemaps);

  return {
    rules: [
      {
        userAgent: 'baiduspider',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'baiduspider-image',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'baiduspider-mobile',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'baiduspider-news',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'baiduspider-video',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'msnbot',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'msnbot-media',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'adidxbot',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'Googlebot-Mobile',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'Googlebot-Video',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'Storebot-Google',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'slurp',
        allow: '/',
        disallow: '/profile',
      },
      {
        userAgent: 'yandex',
        allow: '/',
        disallow: '/profile',
      },
    ],
    sitemap: [`${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`].concat(
      bridgeSitemaps,
    ),
  };
}
