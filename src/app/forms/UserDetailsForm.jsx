"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";
import { updateUserData } from "../actions/pageActions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const UserDetailsForm = ({ userData, email }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      phone_number: userData?.phone_number || "",
      street: userData?.street || "",
      building: userData?.building || "",
      floor: userData?.floor || "",
      apartment: userData?.apartment || "",
      city: userData?.city || "",
      country: userData?.country || "EG",
    },
  });

  useEffect(() => {
    if (!userData) {
      toast.error(
        "Thank you for your interest, Please complete your information first."
      );
    }
  }, [userData]);

  const onSubmit = async (data) => {
    setLoading(true);

    const sanitizedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, validator.escape(value)])
    );

    try {
      const res = await updateUserData(email, sanitizedData);

      if (res.success) {
        toast.success(res.message);
        reset(sanitizedData);
        router.back(); // Go back after success
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error(error.message || "Error updating user data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 w-full">
      <div className="mt-2 grid grid-cols-2 gap-4 border-t border-b py-4 rounded-md">
        {[
          ["first_name", "First Name"],
          ["last_name", "Last Name"],
          ["phone_number", "Phone Number"],
          ["street", "Street"],
          ["building", "Building"],
          ["floor", "Floor"],
          ["apartment", "Apartment"],
          ["city", "City"],
          ["country", "Country"],
        ].map(([name, label]) => (
          <div className="flex flex-col gap-2" key={name}>
            <label className="font-semibold" htmlFor={name}>
              {label}
            </label>
            <input
              {...register(name, { required: `${label} is required` })}
              className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
              id={name}
              placeholder={label}
            />
            {errors[name] && (
              <p className="text-red-500">{errors[name]?.message}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`border w-full rounded-lg py-2 transition-all shadow-md hover:shadow-xl text-white 
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#2196f3] hover:bg-blue-600"
          } mt-4`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
