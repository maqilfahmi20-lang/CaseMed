import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CaseMed - Platform Latihan UKMPPD Online Terbaik",
    template: "%s | CaseMed"
  },
  description: "Platform latihan soal UKMPPD online terlengkap dengan ribuan soal berkualitas, pembahasan detail, dan simulasi ujian. Persiapan UKMPPD jadi lebih mudah dengan CaseMed!",
  keywords: [
    "UKMPPD",
    "latihan UKMPPD",
    "soal UKMPPD",
    "simulasi UKMPPD",
    "tryout UKMPPD",
    "ujian dokter",
    "kedokteran",
    "CBT UKMPPD",
    "persiapan UKMPPD",
    "belajar UKMPPD online",
    "platform UKMPPD",
    "CaseMed"
  ],
  authors: [{ name: "CaseMed" }],
  creator: "CaseMed",
  publisher: "CaseMed",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.casemed.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'CaseMed',
    title: 'CaseMed - Platform Latihan UKMPPD Online Terbaik',
    description: 'Platform latihan soal UKMPPD online terlengkap dengan ribuan soal berkualitas, pembahasan detail, dan simulasi ujian.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CaseMed - Platform Latihan UKMPPD',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CaseMed - Platform Latihan UKMPPD Online Terbaik',
    description: 'Platform latihan soal UKMPPD online terlengkap dengan ribuan soal berkualitas, pembahasan detail, dan simulasi ujian.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google93f27d10cdbb9c62',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'CaseMed',
    description: 'Platform latihan soal UKMPPD online terlengkap dengan ribuan soal berkualitas',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.casemed.com',
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.casemed.com'}/logo.png`,
    sameAs: [
      // Add your social media URLs here
      // 'https://www.facebook.com/casemed',
      // 'https://www.instagram.com/casemed',
      // 'https://twitter.com/casemed'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      availableLanguage: 'Indonesian'
    },
    offers: {
      '@type': 'Offer',
      category: 'Subscription',
      price: '55000',
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
    }
  };

  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
