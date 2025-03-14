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

    if (!courseId) {
      return NextResponse.json(
        { error: "Missing course ID in webhook" },
        { status: 400 }
      );
    }

    // Update course access
    const newOrder = new Order({ userId, courseId, status: "completed" });
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

//   const { userId, courseId } = await req.json();
//  try {
//   await connectToDatabase();

//   if (!userId || !courseId) {
//     return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
//   }

//   const course = await Course.findById(courseId);
//   if (!course) {
//     return NextResponse.json({success: false, message: "Course not found" }, { status: 404 });
//   }

//   const existingOrder = await Order.findOne({ userId, courseId });
//   if (existingOrder) {
//     return NextResponse.json({ message: "Already purchased" }, { status: 400 });
//   }

//   const order = new Order({ userId, courseId, status: "completed" });
//   await order.save();

//   return NextResponse.json({ success: true, message: "Course purchased successfully" });
//  } catch (error) {
//   return NextResponse.json({ error: error.message || "Failed to purchase course" }, { status: 500 });
//  }
