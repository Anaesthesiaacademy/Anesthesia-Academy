import DelayedRedirectClient from "../../components/DelayedRedirectClient";

export default async function PaymentResult({ searchParams }) {
  const params = await searchParams;
  const merchantOrderId = params?.merchant_order_id;
  const courseId = merchantOrderId.split("-")[0];

  return (
    <>
      <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
        <h1 className="text-4xl font-bold">Payment Result</h1>
        {params.success === "true" && params.error_occured === "false" ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-green-600">
              ✅ Payment Successful! congratulations 🎉
            </h1>
            <p>Redirecting to your courses...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-red-600">
              ❌ Oops! {params["data.message"] || "Something went wrong"},
              please try again
            </h1>
            <p>Redirecting back to courses...</p>
          </div>
        )}
      </div>
      <DelayedRedirectClient id={courseId} />
    </>
  );
}
