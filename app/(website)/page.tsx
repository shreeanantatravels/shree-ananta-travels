import type { Metadata } from "next";
import Home from "@website/app/pages/Home";

export const metadata: Metadata = {
  title: {
    absolute:
      "Shree Ananta Travels — Yatras, Domestic & International Tours",
  },
  description:
    "Shree Ananta Travels: Leading Kailash & Adi Kailash Yatra agency in India. Spiritual yatras, Char Dham, and customized tour packages.",
  keywords: [
    "Shree Ananta Travels",
    "Kailash Mansarovar Yatra",
    "Adi Kailash Yatra",
    "Char Dham Yatra",
    "spiritual tour packages",
    "domestic tour packages",
    "international tour packages",
    "tour packages India",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Shree Ananta Travels — Yatras, Domestic & International Tours",
    description:
      "Leading Kailash & Adi Kailash Yatra agency in India. Spiritual yatras, Char Dham, and customized tour packages.",
    url: "/",
    siteName: "Shree Ananta Travels",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Shree Ananta Travels — Journeys That Connect",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Shree Ananta Travels — Yatras, Domestic & International Tours",
    description:
      "Leading Kailash & Adi Kailash Yatra agency in India. Spiritual yatras, Char Dham, and customized tour packages.",
    images: ["/icon.png"],
  },
};

export default function HomePage() {
  return <Home />;
}
