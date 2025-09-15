import Link from "next/link";
import React from "react";
import LogoutBtn from "./LogoutBtn";
import { FaArrowLeft } from "react-icons/fa6";
import SideNavLink from "./SideNavLink";

export default function Sidenav() {
  const links = [
    {
      id: 1,
      title: "Overview",
      href: "/dashboard/overview",
    },
    {
      id: 2,
      title: "Courses",
      href: "/dashboard/courses",
    },
    {
      id: 3,
      title: "Videos",
      href: "/dashboard/videos",
    },
    {
      id: 4,
      title: "Settings",
      href: "/dashboard/settings",
    },
  ];

  return (
    <aside className="bg-zinc-800 fixed w-1/5 h-screen text-white flex flex-col items-center justify-between pb-4 ">
      <div className="flex flex-col items-center w-full">
        <div className="w-full flex items-center">
          <Link href={"/"} className="w-fit p-2 z-50">
            <FaArrowLeft size={25} className="cursor-pointer text-white" />
          </Link>
        </div>
        <div className="mt-5">Logo</div>

        <div className="w-full">
          <h4 className="md:text-2xl text-xl font-semibold text-center my-5">
            Anaesthesia Academy
          </h4>
          <div className="flex flex-col gap-4 px-3">
            {links.map((link) => (
              <SideNavLink link={link} key={link.id}>
                {link.title}
              </SideNavLink>
            ))}
          </div>
        </div>
      </div>

      <LogoutBtn />
    </aside>
  );
}
