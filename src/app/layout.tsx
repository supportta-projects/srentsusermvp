import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { generateMetadata as generateSEOMetadata, getSiteUrl, getCanonicalUrl } from "@/lib/seo";
import { StructuredData, generateWebSiteStructuredData } from "@/components/StructuredData";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import FloatingWhatsapp from "@/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();
const defaultTitle = "rentorent - Premium Rental Marketplace";
const defaultDescription = "Rent anything, anywhere. Discover rental shops near you. From cameras to dresses, power tools to jewellery.";
const defaultKeywords = ["rental marketplace", "equipment rental", "camera rental", "dress rental", "tool rental", "rental shop", "rent anything"];

export const metadata: Metadata = generateSEOMetadata({
  title: defaultTitle,
  description: defaultDescription,
  keywords: defaultKeywords,
  canonicalUrl: getCanonicalUrl("/"),
  openGraph: {
    type: "website",
    siteName: "rentorent",
    title: defaultTitle,
    description: defaultDescription,
    url: getCanonicalUrl("/"),
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [`${siteUrl}/og-image.jpg`],
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#DC2626" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <AuthProvider>
          {/* Scroll to top on route change */}
          <ScrollToTop />
          {/* WebSite Structured Data */}
          <StructuredData data={generateWebSiteStructuredData()} />
          
          {/* Google Analytics */}
          {process.env.NEXT_PUBLIC_GA_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `}
              </Script>
            </>
          )}
          {children}
        </AuthProvider>
        
        {/* Floating layer – independent of page content */}
        {/* Direct child of <body>, outside all containers including AuthProvider */}
        <FloatingWhatsapp />
      </body>
    </html>
  );
}
