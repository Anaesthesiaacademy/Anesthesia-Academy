import { IoPersonSharp } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import Link from "next/link";

export default function ContactSection() {
  return (
    <div className="bg-gray-100" id="contact">
      <div className="max-w-7xl mx-auto py-20 px-3">
        <div className="text-center mb-6">
          <h2 className="md:text-4xl text-3xl font-bold mb-3 text-slate-900">
            Contact Us
          </h2>
        </div>

        <div className="flex justify-between gap-5 flex-col md:flex-row">
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-7 flex justify-center flex-col items-center gap-4 hover:-translate-y-1 transition-all">
            <div>
              <IoPersonSharp size={38} color="#2196f3" />
            </div>
            <h4 className="md:text-xl text-lg font-semibold mb-3 text-slate-900">
              Dr. Abdelrhman Alshawadfy
            </h4>
            <p className="text-slate-600 text-base text-center">
              Assistant Professor of Anesthesia, Intensive Care, and Pain
              Management
            </p>
            <p className="text-slate-600 text-base text-center">
              Faculty of Medicine - Suez Canal University
            </p>
          </div>
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-7 flex justify-center flex-col items-center gap-4 hover:-translate-y-1 transition-all">
            <div>
              <FaWhatsapp size={38} color="#2196f3" />
            </div>
            <h4 className="md:text-xl text-lg font-semibold mb-3 text-slate-900">
              WhatsApp
            </h4>
            <div>
              <Link
                href="https://wa.me/201091091620"
                target="_blank"
                className="bg-[#25D366] inline-block text-center transition-colors hover:bg-[#128C7E] text-white w-full py-3 px-4 text-lg rounded-md"
              >
                Contact us on WhatsApp
              </Link>
            </div>
            <p className="text-slate-600 text-lg text-center font-semibold">
              +20 1091091620
            </p>
          </div>
          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-7 flex flex-col items-center gap-4 hover:-translate-y-1 transition-all">
            <div>
              <FaEnvelope size={38} color="#2196f3" />
            </div>
            <h4 className="md:text-xl text-lg font-semibold mb-3 text-slate-900">
              Email
            </h4>
            <Link
              href="mailto:info@anaesthesia-academy.com"
              className="inline-block text-center transition-colors text-sky-600 w-full text-lg rounded-md"
            >
              info@anaesthesia-academy.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
