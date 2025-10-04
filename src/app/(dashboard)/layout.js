import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidenav from "../components/dashboardComponents/Sidenav";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
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
    "Anesthesia Academy offers top-tier courses in anesthesiology, including general anesthesia, regional techniques, and pain management. Learn from leading experts in the field.",
  keywords:
    "anesthesia training, anesthesiology courses, pain management, anesthesia techniques, medical education",
  author: "Anesthesia Academy",
  siteUrl: "https://anesthesia-academy.com",
  image: "https://anesthesia-academy.com/logo.png",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

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
      </Head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <main className="flex">
          <Sidenav user={session.user} />
          <div className="bg-[#f5f5f5] w-4/5 min-h-screen ml-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
