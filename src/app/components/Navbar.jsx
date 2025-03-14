"use client";

import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

export default function Navbar({ session }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links = [
    { name: "Home", href: "#home" },
    { name: "Courses", href: "#courses" },
    { name: "Contact", href: "#contact" },
    { name: "About", href: "#about" },
    // { name: "Sign Up", href: "/sign-up" },
  ];
  // const pcLinks = [
  //   { name: "Features", href: "/features" },
  //   { name: "FAQ", href: "/faq" },
  // ];

  return (
    <div className="">
      <div className="fixed z-50 w-full bg-white shadow-md">
        <div
          className={` mx-auto max-w-7xl w-[94%] px-6 md:px-6 py-3 flex items-center justify-between`}
        >
          <div className="flex items-center gap-8">
            {/* Logo SVG */}
            <Link href="/" className="w-12">
              {/* <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              data-v-27e72c32=""
            >
              <path
                d="M11.8922 12.6488V10.5103C11.8922 10.2107 11.7305 10.061 11.407 10.061H9.93335V13.0981H11.407C11.7305 13.0981 11.8922 12.9484 11.8922 12.6488ZM11.8922 17.519V15.2906C11.8922 15.1349 11.8563 15.027 11.7844 14.9671C11.7125 14.8952 11.5867 14.8593 11.407 14.8593H9.93335V17.9683H11.407C11.7305 17.9683 11.8922 17.8186 11.8922 17.519ZM7.39941 8.2998H12.1438C13.6654 8.2998 14.4262 8.95875 14.4262 10.2766V12.2894C14.4262 13.176 14.1566 13.7331 13.6174 13.9607C14.1566 14.1644 14.4262 14.6796 14.4262 15.5063V17.7347C14.4262 19.0646 13.6654 19.7295 12.1438 19.7295H7.39941V8.2998Z"
                fill={`${dark ? "white" : "black"}`}
                data-v-27e72c32=""
              ></path>{" "}
              <path
                d="M16.0002 8.2998H18.5521V19.7295H16.0002V8.2998Z"
                fill={`${dark ? "white" : "black"}`}
                data-v-27e72c32=""
              ></path>{" "}
              <path
                d="M22.4389 8.2998H24.8471C26.3566 8.2998 27.1114 8.95875 27.1114 10.2766V17.7347C27.1114 19.0646 26.3566 19.7295 24.8471 19.7295H22.4389C20.9174 19.7295 20.1566 19.0646 20.1566 17.7347V10.2766C20.1566 8.95875 20.9174 8.2998 22.4389 8.2998ZM24.5415 17.3932V10.6361C24.5415 10.3365 24.3858 10.1868 24.0743 10.1868H23.2117C22.8882 10.1868 22.7265 10.3365 22.7265 10.6361V17.3932C22.7265 17.6928 22.8882 17.8425 23.2117 17.8425H24.0743C24.3858 17.8425 24.5415 17.6928 24.5415 17.3932Z"
                fill={`${dark ? "white" : "black"}`}
                data-v-27e72c32=""
              ></path>{" "}
              <path
                d="M9.96109 31.852H13.2498V33.739H7.40918V22.3093H9.96109V31.852Z"
                fill={`${dark ? "white" : "black"}`}
                data-v-27e72c32=""
              ></path>{" "}
              <path
                d="M14.1321 22.3093H16.684V33.739H14.1321V22.3093Z"
                fill={`${dark ? "white" : "black"}`}
                data-v-27e72c32=""
              ></path>{" "}
              <path
                d="M23.1407 22.3093H25.4949V33.739H23.1946L20.6966 26.892V33.739H18.3604V22.3093H20.6787L23.1407 29.1384V22.3093Z"
                fill={`${dark ? "white" : "black"}`}
                data-v-27e72c32=""
              ></path>{" "}
              <path
                d="M34.6841 22.3093L32.3838 27.9523L34.6841 33.739H31.9166L29.7061 27.9523L31.9166 22.3093H34.6841ZM27.1003 33.739V22.3093H29.6522V33.739H27.1003Z"
                fill={`${dark ? "white" : "black"}`}
                data-v-27e72c32=""
              ></path>{" "}
              <path
                d="M1 1H41V41H1V1Z"
                stroke={`${dark ? "white" : "black"}`}
                strokeWidth="2"
                strokeLinejoin="round"
                data-v-27e72c32=""
              ></path>
            </svg> */}
              <Image src="/logo.png" alt="logo" width={100} height={100} />
            </Link>

            {/* Links */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-semibold text-black `}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div className="h-full">
            <ul className="flex h-full items-center gap-6">
              <li>
                {session ? (
                  <Link
                    href="/dashboard/overview"
                    className={`font-semibold text-black`}
                  >
                    Hello, {session?.user?.name?.split(" ")[0]}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      signIn("google")
                    }}
                    className={`font-semibold text-black`}
                  >
                    Log in
                  </button>
                )}
              </li>
              <li>
                {session ? (
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className={`px-3 py-3 bg-black text-white rounded-full font-semibold`}
                  >
                    Log out
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push("/sign-up")}
                    href="/sign-up"
                    className={`px-6 py-3 bg-black text-white rounded-full font-semibold`}
                  >
                    Sign up
                  </button>
                )}
              </li>
              <li className={`md:hidden text-black`}>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <CiMenuBurger className="text-2xl" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sidebar */}

      <div
        className={`fixed top-0 transition-all duration-500 ${
          isSidebarOpen ? "left-0" : "-left-full"
        } z-50 w-full h-screen flex-col gap-10 pt-10 text-black bg-white flex items-center`}
      >
        <div className="w-full text-right pr-5">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <IoClose className="text-3xl" />
          </button>
        </div>
        <ul className="flex flex-col p-4 text-2xl font-semibold w-full divide-y">
          {links.map((link) => (
            <li key={link.name} className={`pl-4 py-4 text-black`}>
              <Link href={link.href} onClick={() => setIsSidebarOpen(false)}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
