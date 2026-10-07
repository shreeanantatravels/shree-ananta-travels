"use client";
import WebsiteLayout from './(website)/layout';
import NotFoundPage from '@website/app/pages/NotFoundPage';

export default function GlobalNotFound() {
  return (
    <WebsiteLayout>
      <NotFoundPage />
    </WebsiteLayout>
  );
}
