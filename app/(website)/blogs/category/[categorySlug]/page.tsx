import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function LegacyCategoryArchiveRedirect({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  // Permanently redirect to canonical /blogs/[categorySlug]
  redirect(`/blogs/${categorySlug}`);
}
