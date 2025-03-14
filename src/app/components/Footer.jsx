import Link from "next/link";
import { PiYoutubeLogoFill } from "react-icons/pi";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="bg-zinc-800 h-fit">
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex justify-between gap-5 flex-col md:flex-row text-white pt-14 px-3 pb-20 border-b">
        <div className="w-1/3">
          <Link href="/" className="w-12">
          <Image src="/logo.png" alt="logo" width={100} height={100} /></Link>
        </div>
        <div className="w-1/3">
          <div className="mb-3 text-lg font-semibold">Quick Links</div>
          <div className="flex flex-col gap-1">
            <Link href="#">Home</Link>
            <Link href="#">About</Link>
            <Link href="#">Contact</Link>
            <Link href="#">Courses</Link>
          </div>
        </div>
        <div className="w-1/3">
          <div className="mb-3 text-lg font-semibold">Follow Us</div>
          <div className="flex gap-4">
            <Link href="#"><FaFacebook size={22} /></Link>
            <Link href="#"><PiYoutubeLogoFill size={22} /></Link>
            <Link href="#"><FaInstagram size={22} /></Link>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center py-5 tex-sm md:text-base">
        <p className="text-white">© {new Date().getFullYear()} Anaesthesia Academy. All rights reserved.</p>
      </div>
      </div>
    </div>
  );
}
