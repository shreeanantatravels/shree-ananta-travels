import { Topbar } from "@website/app/components/Topbar";
import { Navbar } from "@website/app/components/Navbar";
import { Footer } from "@website/app/components/Footer";

export default function PackageDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col">
      <Topbar />
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-slate-200 dark:bg-gray-800 rounded w-1/4" />

        {/* Title & Badge Skeleton */}
        <div className="space-y-3">
          <div className="h-6 bg-slate-200 dark:bg-gray-800 rounded w-28" />
          <div className="h-10 bg-slate-200 dark:bg-gray-800 rounded w-3/4 max-w-2xl" />
          <div className="h-5 bg-slate-200 dark:bg-gray-800 rounded w-1/2 max-w-md" />
        </div>

        {/* Gallery & Sidebar Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Visual Skeleton */}
          <div className="lg:col-span-8 space-y-6">
            <div className="aspect-[16/9] w-full bg-slate-200 dark:bg-gray-800 rounded-3xl" />
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[16/9] bg-slate-200 dark:bg-gray-800 rounded-xl" />
              ))}
            </div>
            {/* Itinerary Overview Placeholder */}
            <div className="h-48 bg-slate-200 dark:bg-gray-800 rounded-2xl mt-8" />
          </div>

          {/* Booking Card Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="h-96 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 space-y-5 shadow-sm">
              <div className="h-6 bg-slate-200 dark:bg-gray-800 rounded w-1/3" />
              <div className="h-12 bg-slate-200 dark:bg-gray-800 rounded w-2/3" />
              <div className="h-10 bg-slate-200 dark:bg-gray-800 rounded w-full" />
              <div className="h-12 bg-slate-200 dark:bg-gray-800 rounded-xl w-full mt-6" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
