import { NextResponse } from "next/server";
import { createOrder, getAuthToken, getPaymentKey } from "@/src/app/lib/paymob";

export async function POST(req) {

try {
  const { amount, courseId, userId, userData } = await req.json();

  // Step 1: Get authentication token
  const token = await getAuthToken();

  // Step 2: Create an order
  const orderId = await createOrder(token, amount, userId, courseId);
  
  // Step 3: Generate payment key
  const paymentKey = await getPaymentKey(token, orderId, amount, userData);
  
  // Step 4: Redirect user to Paymob payment page
  const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/900094?payment_token=${paymentKey}`;

  return NextResponse.json({ success: true, message: 'Payment initiated successfully', data: paymentUrl }, { status: 200 });
} catch (error) {
  console.error(error);
  return NextResponse.json({ success: false, message: error.message || 'Payment initiation failed' }, { status: 500 });
}

}
