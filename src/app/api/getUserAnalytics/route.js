import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/connectToDb";
import Order from "../../models/Order";
import Course from "../../models/Course";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });

    const orders = await Order.find({ userId: id, status: "completed" }, "courseId _id createdAt")
      .populate("courseId", "title price thumbnail count")
      .exec();      

    const simplifiedOrders = orders.map((order) => ({
      courseId: order.courseId
        ? {
            _id: order.courseId._id,
            title: order.courseId.title,
            price: order.courseId.price,
            thumbnail: order.courseId.thumbnail,
            count: order.courseId.count,
          }
        : null,
      createdAt: order.createdAt,
    }));

    const ordersCount = simplifiedOrders.length;
    const totalVideosCount = simplifiedOrders.reduce((total, order) => total + (order.courseId?.count || 0), 0);

    return NextResponse.json({ success: true, orders: simplifiedOrders, tabsData: [
      { id: 1, title: "Courses Enrolled", count: ordersCount },
      { id: 2, title: "Lessons", count: totalVideosCount },
    ] });
  } catch (error) {
    console.error("Error in getUserAnalytics:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}