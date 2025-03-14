import React from "react";
import FormWrapper from "../../components/passwordComponents/FormWrapper";
import Link from "next/link";

export default function ResetPassword() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <FormWrapper title="Reset Password">
        <div className="w-full flex-1">
          <form>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className=" font-semibold">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@.com"
                className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
              />
            </div>
            <div className="mt-14">
              <button
                type="submit"
                className="bg-[#2196f3] inline-block text-center transition-colors hover:bg-blue-600 text-white w-full py-2 px-4 rounded"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
        <div>
          <Link href="/login" className="text-gray-500 underline">
            Back to Login
          </Link>
        </div>
      </FormWrapper>
    </div>
  );
}
