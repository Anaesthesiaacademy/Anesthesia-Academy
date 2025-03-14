import Image from "next/image";
import React from "react";

export default function FormWrapper({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-7 my-10 flex flex-col items-center gap-8 w-11/12 mx-auto md:w-[400px] h-fit">
      <div className="w-20">
        <Image src="/logo.png" alt="logo" width={100} height={100} />
      </div>
      <div>
        <h2 className="text-xl text-center font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
