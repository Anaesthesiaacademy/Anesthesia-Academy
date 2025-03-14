import React from "react";
import FormWrapper from "../../components/passwordComponents/FormWrapper";
import Link from "next/link";

export default function page() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <FormWrapper title="Reset Password">
        <div className="w-full flex-1">
          <form className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className=" font-semibold">
                New Password
              </label>
              <input
                type="password"
                name="new-password"
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
                name="confirm-new-password"
                id="confirmPassword"
                placeholder="confirm password"
                className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-[#2196f3] inline-block text-center transition-colors hover:bg-blue-600 text-white w-full py-2 px-4 rounded"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Link
            href="/login"
            className="text-center text-[#2196f3] font-semibold hover:underline flex items-center justify-center gap-2"
          >
            Back to Login
          </Link>
        </div>
      </FormWrapper>
    </div>
  );
}
