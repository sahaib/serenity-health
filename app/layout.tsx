import './globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { EB_Garamond } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://serenityhealth.sahaibsingh.com'),
  title: {
    template: '%s | Serenity Health AI',
    default: 'Serenity Health AI - Your Supportive Mental Health Companion',
  },
  description: 'Serenity Health AI offers compassionate mental health support through AI-powered conversations. Get personalized guidance, emotional support, and coping strategies in a safe, judgment-free space.',
  keywords: [
    'mental health AI',
    'AI therapy companion',
    'emotional support',
    'mental wellness',
    'digital mental health',
    'AI counseling',
    'mental health support',
    'psychological wellbeing',
    'stress management',
    'anxiety help',
    'depression support',
    'emotional wellness',
    'mental health chat',
    'AI mental health assistant',
    'psychological support'
  ],
  authors: [{ name: 'Sahaib', url: 'https://x.com/imsahaib' }],
  creator: 'Sahaib',
  publisher: 'Serenity Health AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://serenityhealth.sahaibsingh.com',
    title: 'Serenity Health AI - Your Supportive Mental Health Companion',
    description: 'Get compassionate mental health support through AI-powered conversations. Experience personalized guidance in a safe, judgment-free space.',
    siteName: 'Serenity Health AI',
    images: [
      {
        url: 'https://serenityhealth.sahaibsingh.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Serenity Health AI - Mental Health Support',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serenity Health AI - Your Supportive Mental Health Companion',
    description: 'Experience compassionate mental health support through AI-powered conversations. Get personalized guidance in a safe space.',
    creator: '@imsahaib',
    images: ['https://serenityhealth.sahaibsingh.com/twitter-image.png'],
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
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://serenityhealth.sahaibsingh.com',
  },
  icons: {
    icon: [
      {
        url: '/favicon.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/icon-512.png',
      },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={ebGaramond.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Schema.org markup for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Serenity Health AI",
              "description": "AI-powered mental health support platform offering compassionate conversations and guidance.",
              "url": "https://serenityhealth.sahaibsingh.com",
              "applicationCategory": "HealthApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Person",
                "name": "Sahaib",
                "url": "https://x.com/imsahaib"
              },
              "provider": {
                "@type": "Organization",
                "name": "Serenity Health AI",
                "url": "https://serenityhealth.sahaibsingh.com"
              }
            })
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
