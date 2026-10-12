import type { Metadata } from "next";
import Home from "@website/app/pages/Home";

export const metadata: Metadata = {
  title: {
    absolute:
      "Shree Ananta Travels - kailash and Adi Kailash Yatra Agency in India",
  },
  description:
    "Shree Ananta Travels is the kailash and Adi Kailash Yatra agency in India. Customized spiritual yatras, Char Dham Yatra, domestic holidays & international tour packages with pure veg food and full permit assistance.",
  keywords: [
    "kailash and Adi Kailash Yatra Agency in India",
    "Kailash Mansarovar Yatra",
    "Adi Kailash Yatra",
    "Om Parvat Yatra",
    "Char Dham Yatra",
    "Shree Ananta Travels",
    "spiritual tour packages",
    "domestic tour packages",
    "international tour packages",
    "holiday packages India",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title:
      "Shree Ananta Travels - kailash and Adi Kailash Yatra Agency in India",
    description:
      "Shree Ananta Travels is the kailash and Adi Kailash Yatra agency in India. Customized spiritual yatras, Char Dham Yatra, domestic holidays & international tour packages with pure veg food and full permit assistance.",
    url: "/",
    siteName: "Shree Ananta Travels",
    type: "website",
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
      "Shree Ananta Travels - kailash and Adi Kailash Yatra Agency in India",
    description:
      "Shree Ananta Travels is the kailash and Adi Kailash Yatra agency in India. Customized spiritual yatras, Char Dham Yatra, domestic holidays & international tour packages with pure veg food and full permit assistance.",
  },
};

export default function HomePage() {
  return <Home />;
}
