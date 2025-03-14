"use client";

import { signOut } from "next-auth/react";
import React from "react";

export default function LogoutBtn() {
  return (
    <div className="w-full px-3">
      <button
        type="button"
        onClick={() => signOut()}
        className="hover:bg-zinc-700 rounded-lg transition-colors duration-300 p-3 w-full text-left"
      >
        Logout
      </button>
    </div>
  );
}
