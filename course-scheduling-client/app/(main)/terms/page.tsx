import { MDXRemote } from 'next-mdx-remote/rsc';
import fs from 'fs';

export default async function Page() {
  const markdown = fs.readFileSync('app/terms-of-service.md', 'utf8');
  return (
    <main>
      <section className="mx-auto flex w-full max-w-content-width items-stretch px-md">
        <div className="flex w-full flex-col items-center justify-between gap-xxl py-xxl">
          <div>
            <h1 className="pb-sm max-lg:text-h3-mobile lg:text-h3-desktop">
              Terms of Service
            </h1>
          </div>
          <div>
            <article className="prose dark:prose-invert">
              <MDXRemote source={markdown} />
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
