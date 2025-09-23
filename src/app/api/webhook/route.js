import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/connectToDb";
import Order from "../../models/Order";

export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { obj } = body;

    console.log("📦 Paymob Webhook Payload:", obj);

    if (!obj) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    if (!obj.success) {
      return NextResponse.json(
        { success: false, message: obj.data.message || "Payment failed" },
        { status: 400 }
      );
    }

    const { order } = obj;
    const merchantOrderId = order?.merchant_order_id;
    const courseId = merchantOrderId.split("-")[0];
    const userId = merchantOrderId.split("-")[1];

    console.log("courseId", courseId)
    console.log("order", order)

    if (!courseId) {
      return NextResponse.json(
        { error: "Missing course ID in webhook" },
        { status: 400 }
      );
    }

    const hashids = new Hashids(process.env.NEXT_PUBLIC_SECRET_ID, 10);

    const realId = hashids.decodeHex(courseId)

    // Update course access
    const newOrder = new Order({ userId, courseId: realId, status: "completed" });
    await newOrder.save();

    return NextResponse.json({
      success: true,
      message: "Payment completed successfully",
    });
  } catch (error) {
    console.error("❌ Paymob Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
