import { permanentRedirect, notFound } from 'next/navigation';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/connect';
import Package from '@/lib/db/models/Package';

export default async function LegacyPackageRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();

  const query: any = {
    $or: [
      { slug: id },
      { redirectFromSlugs: id },
      ...(mongoose.isValidObjectId(id) ? [{ _id: id }] : []),
    ],
  };

  const pkg = await Package.findOne(query).select('slug _id isActive').lean();

  if (!pkg || pkg.isActive === false) {
    notFound();
  }

  // Permanently redirect (308) legacy ID-based URLs to the canonical slug URL
  const destination = pkg.slug ? `/packages/${pkg.slug}` : `/packages`;
  permanentRedirect(destination);
}
