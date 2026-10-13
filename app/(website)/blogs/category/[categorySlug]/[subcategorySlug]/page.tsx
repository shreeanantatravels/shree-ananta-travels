import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function LegacySubcategoryArchiveRedirect({
  params,
}: {
  params: Promise<{ categorySlug: string; subcategorySlug: string }>;
}) {
  const { categorySlug } = await params;
  // Permanently redirect to canonical category page /blogs/[categorySlug]
  redirect(`/blogs/${categorySlug}`);
}
