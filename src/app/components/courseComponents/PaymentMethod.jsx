"use client";

import { useForm } from "react-hook-form";
import { upload } from "../../lib/upload";
import toast from "react-hot-toast";
import { useState } from "react";
import { makeOrderReq } from "../../actions/pageActions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SiVodafone } from "react-icons/si";
import PrimaryButton from "../ui/PrimaryButton";
import { ImSpinner2 } from "react-icons/im";
import axios from "axios";
import Modal from "./Modal";
import validator from "validator";
import Link from "next/link";

export default function PaymentMethod({ courseId }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm();

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data) => {
    const finalData = {
      name: validator.escape(data.name),
      paymentNumber: `${
        paymentMethod === "Instapay" ? "Instapay ID: " : "We Pay Number: "
      }${validator.escape(data.paymentNumber)}`,
      communicationNumber: validator.escape(data.communicationNumber),
      paymentMethod,
      screenshot: {
        url: thumbnailPreview?.url,
        cloudId: thumbnailPreview?.cloudId,
      },
      courseId,
    };

    console.log("Final form data:", finalData);

    try {
      const res = await makeOrderReq(finalData);
      if (!res.success) {
        toast.error(
          res.message || "Failed to submit payment. Please try again."
        );
        return;
      }

      // send email to user
      const emailRes = await axios.post("/api/cron-job/sendEmail", {
        to: "dr.nabil2025@gmail.com",
        subject: "Order Request",
        message: `A new order request has been made. Please check the dashboard for details. ${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/payments`,
      });

      if (!emailRes.data.success) {
        toast.error(
          "Failed to send confirmation email. Please send email manually to dr.nabil2025@gmail.com."
        );
        return;
      }

      toast.success("Request submitted successfully!");
      setMessage(
        "Thank you for your order, we will approve it and contact you on your email very soon!"
      );
    } catch (error) {
      toast.error("Failed to submit payment. Please try again.");
      return;
    }
    // Submit to backend here
    reset();
    setThumbnailPreview(null);
  };

  async function handleUpload(ev) {
    upload(ev, async ({ url, fileName: cloudId }) => {
      if (url) {
        setThumbnailPreview({ url, cloudId });

        // Set hidden form values to include in form submission
        setValue("screenshotUrl", url);
        setValue("screenshotId", cloudId);

        toast.success("Screenshot uploaded successfully!");
      }
    });
  }

  return (
    <div className="max-w-xl mx-auto py-4 px-6 bg-white rounded shadow">
      <h1
        className={`text-2xl font-bold mb-6 ${
          message && "text-green-600 text-center"
        }`}
      >
        {message || "Payment Method"}
      </h1>

      {message && (
        <p
          className={`text-xl font-bold text-center mt-2 cursor-pointer`}
          onClick={() => router.push("/")}
        >
          go to home
        </p>
      )}

      {!message && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Payment Method Boxes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Choose Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Instapay Box */}
              <label
                onClick={() => setModalOpen(true)}
                htmlFor="instapay"
                className="border rounded-lg p-4 cursor-pointer flex flex-col justify-between items-center gap-2 hover:border-blue-500 transition"
              >
                <input
                  type="radio"
                  id="instapay"
                  value="Instapay"
                  {...register("paymentMethod", { required: true })}
                  className="sr-only"
                />
                <div className="relative w-fit p-2 bg-purple-800 rounded shadow">
                  <Image
                    src="/instapay-logo.png"
                    alt="Instapay Logo"
                    width={70}
                    height={70}
                    className="object-contain"
                  />
                </div>
                <span className="font-medium text-center">Instapay</span>
                Open Instapay
              </label>

              {/* Vodafone Cash Box */}
              <label
                htmlFor="we"
                className="border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-between gap-2 hover:border-blue-500 transition"
              >
                <input
                  onClick={() => setModalOpen(true)}
                  type="radio"
                  id="we"
                  value="We"
                  {...register("paymentMethod", { required: true })}
                  className="sr-only"
                />
                <Image
                  src="/wePayLogo.png"
                  alt="We Logo"
                  width={70}
                  height={70}
                  className="object-contain"
                />
                <span className="font-medium text-center">We Pay</span>
                Open We Pay
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-2">
                Please select a payment method
              </p>
            )}
          </div>

          <div className="flex flex-col border-t border-gray-700 pt-5 gap-5">
            <div>
              <label className="block text-sm font-medium" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
                id="name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Communication Number */}
            <div>
              <label
                className="block text-sm font-medium"
                htmlFor="communicationNumber"
              >
                Communication Number
              </label>
              <input
                type="text"
                {...register("communicationNumber", {
                  required: "Communication number is required",
                })}
                className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
                id="communicationNumber"
              />
              {errors.communicationNumber && (
                <p className="text-red-500 text-sm">
                  {errors.communicationNumber.message}
                </p>
              )}
            </div>
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Choose Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    defaultChecked
                    value="Instapay"
                    {...register("paymentMethod", { required: true })}
                  />
                  Instapay
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="We"
                    {...register("paymentMethod", { required: true })}
                  />
                  We Pay
                </label>
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm">
                  Please select a payment method
                </p>
              )}
            </div>

            {/* Payment Number */}
            <div>
              <label
                className="block text-sm font-medium"
                htmlFor="paymentNumber"
              >
                {paymentMethod === "We" ? "Wallet Number" : "Instapay ID"}
              </label>
              <input
                type="text"
                {...register("paymentNumber", {
                  required: "Payment number is required",
                })}
                className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
                id="paymentNumber"
              />
              {errors.paymentNumber && (
                <p className="text-red-500 text-sm">
                  {errors.paymentNumber.message}
                </p>
              )}
            </div>

            {/* Upload Screenshot */}
            <div className="py-3 flex flex-col gap-3">
              <label className="block text-sm font-medium">
                Upload Payment Screenshot
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="p-2 bg-[#f3f5f7] transition-colors border-2 rounded hover:border-[#2e91fc] focus:border-[#2e91fc] outline-none w-full border-blue-300"
              />
              {errors.screenshot && (
                <p className="text-red-500 text-sm">
                  {errors.screenshot.message}
                </p>
              )}

              {/* Screenshot Preview */}
              {thumbnailPreview?.url && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Preview:</p>
                  <Image
                    src={`/api/upload/proxyImage?key=${encodeURIComponent(
                      thumbnailPreview?.cloudId
                    )}`}
                    width={256}
                    height={256}
                    quality={70}
                    alt="Screenshot Preview"
                    className="w-64 rounded border mx-auto"
                  />
                </div>
              )}
            </div>

            {/* Hidden Fields for Submission */}
            <input
              type="hidden"
              {...register("screenshotUrl", { required: true })}
            />
            <input
              type="hidden"
              {...register("screenshotId", { required: true })}
            />

            <PrimaryButton
              type="submit"
              disabled={isSubmitting || !isDirty || !thumbnailPreview}
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <ImSpinner2 size={20} className="animate-spin mx-auto" />
              ) : (
                "Submit Payment"
              )}
            </PrimaryButton>
          </div>
        </form>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
        <p className="text-sm text-gray-600 mb-4 text-wrap">
          Scan the QR code or the number or link to make the payment, then take
          a screenshot to confirm the payment.
        </p>
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src={
              paymentMethod === "Instapay"
                ? "/instapay-qr-code.png"
                : "/wepay-qr-code.png"
            }
            alt="QR Code"
            className="object-contain aspect-square"
            width={200}
            height={200}
          />

          {paymentMethod === "Instapay" ? (
            <p className="text-sm text-gray-600">
              Or use the link:{" "}
              <Link
                href="https://ipn.eg/S/nabilail/instapay/2g3nfz"
                className="text-blue-500 hover:underline"
              >
                https://ipn.eg/S/nabilail/instapay/2g3nfz
              </Link>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Or use the number: <Link href="tel:01505774743" className="font-bold underline text-blue-500">01505774743</Link>
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
