import React from "react";
import FormWrapper from "../../components/passwordComponents/FormWrapper";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function Register() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <FormWrapper title="Create Account">
        <div className="w-full flex-1">
          <form className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-semibold">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="example@.com"
                className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className=" font-semibold">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@.com"
                className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className=" font-semibold">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="password"
                className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className=" font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm Password"
                className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-[#2196f3] inline-block text-center transition-colors hover:bg-blue-600 text-white w-full py-2 px-4 rounded"
              >
                Register
              </button>
            </div>
          </form>
        </div>
        {/* <div className="relative w-0">
          <div className="absolute inset-0 flex items-center justify-between">
            <span className="w-[45%] border-t"></span>
            <span className="font-semibold text-gray-500">Or</span>
            <span className="w-[45%] border-t"></span>
          </div>
        </div> */}
        <div className="flex flex-col gap-4 w-full">
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[#2196f3] hover:underline">
              Login
            </Link>
          </p>

          <Link
            href="/"
            className="text-center text-[#2196f3] font-semibold hover:underline flex items-center justify-center gap-2"
          >
            Back to Home
          </Link>
        </div>
      </FormWrapper>
    </div>
  );
}
