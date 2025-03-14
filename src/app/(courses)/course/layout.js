import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO Metadata
export const metadata = {
  title: "Anesthesia Academy - Expert Anesthesia Training",
  description:
    "Anesthesia Academy provides expert-led courses in anesthesiology. Enhance your skills with hands-on training in general anesthesia, regional techniques, and patient safety.",
  keywords:
    "anesthesia training, anesthesiology courses, pain management, anesthesia techniques, medical education",
  author: "Anesthesia Academy",
  siteUrl: "https://anesthesia-academy.com",
  image: "https://anesthesia-academy.com/logo.png",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Primary Meta Tags */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph (Facebook & LinkedIn) */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.image} />
        <meta property="og:url" content={metadata.siteUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />

        {/* Canonical URL */}
        <link rel="canonical" href={metadata.siteUrl} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Structured Data (Schema Markup) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Anesthesia Academy",
              url: metadata.siteUrl,
              description: metadata.description,
              logo: metadata.image,
              sameAs: [
                "https://www.facebook.com/AnesthesiaAcademy",
                "https://www.linkedin.com/company/anesthesia-academy",
                "https://twitter.com/AnesthesiaAcademy",
              ],
            }),
          }}
        />
      </Head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <main>{children}</main>
      </body>
    </html>
  );
}
