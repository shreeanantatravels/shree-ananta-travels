import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "@website/styles/theme.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.shreeanantatravels.com",
  ),
  title: {
    default:
      "Shree Ananta Travels - Kailash and Adi Kailash Yatra Agency in India",
    template: "%s | Shree Ananta Travels",
  },
  description:
    "Shree Ananta Travels: Leading Kailash & Adi Kailash Yatra agency in India. Spiritual yatras, Char Dham, and customized tour packages.",
  openGraph: {
    siteName: "Shree Ananta Travels",
    type: "website",
    title: "Shree Ananta Travels — Journeys That Connect",
    description:
      "Leading Kailash & Adi Kailash Yatra agency in India. Sacred pilgrimages, Char Dham, and curated tour packages.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Shree Ananta Travels — Journeys That Connect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shree Ananta Travels — Journeys That Connect",
    description:
      "Leading Kailash & Adi Kailash Yatra agency in India. Sacred pilgrimages, Char Dham, and curated tour packages.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect for external assets */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Google Analytics Tag - Loaded lazily to keep main thread fast */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-733S4J5EV4"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-733S4J5EV4', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
