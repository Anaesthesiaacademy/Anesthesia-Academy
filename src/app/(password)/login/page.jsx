import React from "react";
import FormWrapper from "../../components/passwordComponents/FormWrapper";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <FormWrapper title="Login">
        <div className="w-full flex-1">
          <form className="flex flex-col gap-8">
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
            <div>
              <button
                type="submit"
                className="bg-[#2196f3] inline-block text-center transition-colors hover:bg-blue-600 text-white w-full py-2 px-4 rounded"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        </div>
        <div className="relative w-0">
          <div className="absolute inset-0 flex items-center justify-between">
            <span className="w-[45%] border-t"></span>
            <span className="font-semibold text-gray-500">Or</span>
            <span className="w-[45%] border-t"></span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <button
            type="button"
            className="flex items-center gap-2 border border-gray-300 p-2 rounded text-sm pl-20"
          >
            <FcGoogle size={22} /> Login With Google{" "}
          </button>
        </div>
      </FormWrapper>
    </div>
  );
}
