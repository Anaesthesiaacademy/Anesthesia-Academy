"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";
import { updateUserData } from "../actions/pageActions";
import toast from "react-hot-toast";

export const UserDetailsForm = ({ userData, email }) => {
  const [loading, setLoading] = useState(false);

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
        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="first_name">
            First Name
          </label>
          <input
            {...register("first_name", { required: "First Name is required" })}
            className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
            id="first_name"
            placeholder="First Name"
          />
          {errors.first_name && (
            <p className="text-red-500">{errors.first_name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="last_name">
            Last Name
          </label>
          <input
            {...register("last_name", { required: "Last Name is required" })}
            className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
            id="last_name"
            placeholder="Last Name"
          />
          {errors.last_name && (
            <p className="text-red-500">{errors.last_name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="phone_number">
            Phone Number
          </label>
          <input
            {...register("phone_number", {
              required: "Phone Number is required",
            })}
            className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
            id="phone_number"
            placeholder="Phone Number"
          />
          {errors.phone_number && (
            <p className="text-red-500">{errors.phone_number.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="street">
            Street
          </label>
          <input
            {...register("street", { required: "Street is required" })}
            className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
            id="street"
            placeholder="Street"
          />
          {errors.street && (
            <p className="text-red-500">{errors.street.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="building">
            Building
          </label>
          <input
            {...register("building", { required: "Building is required" })}
            className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
            id="building"
            placeholder="Building"
          />
          {errors.building && (
            <p className="text-red-500">{errors.building.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="floor">
            Floor
          </label>
          <input
            {...register("floor", { required: "Floor is required" })}
            className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
            id="floor"
            placeholder="Floor"
          />
          {errors.floor && (
            <p className="text-red-500">{errors.floor.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="apartment">
            Apartment
          </label>
          <input
            {...register("apartment", { required: "Apartment is required" })}
            className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
            id="apartment"
            placeholder="Apartment"
          />
          {errors.apartment && (
            <p className="text-red-500">{errors.apartment.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="city">
            City
          </label>
          <input
            {...register("city", { required: "City is required" })}
            className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
            id="city"
            placeholder="City"
          />
          {errors.city && <p className="text-red-500">{errors.city.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold" htmlFor="country">
            Country
          </label>
          <input
            {...register("country", { required: "Country is required" })}
            id="country"
            className="border border-gray-300 p-2 rounded focus:outline-none transition-shadow focus:shadow-[0px_0px_5px_1px_#2196f3]"
            placeholder="Country"
          />
          {errors.country && (
            <p className="text-red-500">{errors.country.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button with Loading Indicator */}
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