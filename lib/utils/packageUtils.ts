import connectDB from '../db/connect';
import Package from '../db/models/Package';
import { slugifyPackage } from './packageSeoHelper';

export * from './packageSeoHelper';

/**
 * Ensure uniqueness of a package slug in MongoDB
 * If collision occurs with another package, appends -2, -3, etc.
 */
export async function ensureUniquePackageSlug(baseSlug: string, currentPackageId?: string): Promise<string> {
  await connectDB();
  const cleanBase = slugifyPackage(baseSlug) || 'tour-package';
  let candidate = cleanBase;
  let counter = 1;

  while (true) {
    const query: any = {
      $or: [{ slug: candidate }, { redirectFromSlugs: candidate }],
    };
    if (currentPackageId) {
      query._id = { $ne: currentPackageId };
    }

    const existing = await Package.findOne(query).lean();
    if (!existing) {
      return candidate;
    }

    counter += 1;
    candidate = `${cleanBase}-${counter}`;
  }
}
