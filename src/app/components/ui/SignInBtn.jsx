"use client";
import { signIn } from "next-auth/react";

export default function SignInBtn({ title = "Sign In" }) {
  return (
    <button
      type="button"
      onClick={() =>
        signIn("google", {
          callbackUrl: "/",
        })
      }
      className={`text-xl text-[#4d44a9] text-nowrap font-bold rounded border-2 py-1.5 px-4 hover:text-white hover:bg-[#4d44a9] transition-colors cursor-pointer`}
    >
      {title}
    </button>
  );
}
