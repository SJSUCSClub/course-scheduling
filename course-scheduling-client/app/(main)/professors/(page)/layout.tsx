import React from 'react';

export default function Layout({
  featured,
  name,
}: {
  featured: React.ReactNode;
  name: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-content-width px-md">
      {featured}
      {name}
    </main>
  );
}
