import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidenav from "../components/dashboardComponents/Sidenav";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Anesthesia Academy",
  description: `Anesthesia Academy is a premier institution dedicated to advancing knowledge and skills in the field of anesthesiology. Our mission is to provide high-quality education, hands-on training, and cutting-edge resources for medical professionals, students, and aspiring anesthetists.

With a curriculum designed by leading experts, we offer comprehensive courses covering general anesthesia, regional techniques, pain management, and patient safety. Whether you are a beginner or an experienced practitioner, Anesthesia Academy equips you with the latest advancements and best practices to excel in the evolving world of anesthesiology.

Join us and take your expertise to the next level!`,
};

export default async function RootLayout({ children }) {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/")
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <main className="flex">
          <Sidenav />
          <div className="bg-[#f5f5f5] w-4/5 min-h-screen ml-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
