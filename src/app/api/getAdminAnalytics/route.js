import { NextResponse } from "next/server";
import connectToDatabase from "../../lib/connectToDb";
import Course from "../../models/Course";
import { User } from "../../models/User";
import Order from "../../models/Order";

export async function GET() {
  try {
    await connectToDatabase();

    const [totalCourses, totalVideosCount, usersCount, orderCount] = await Promise.all([
      Course.estimatedDocumentCount(), // Fast count without scanning documents
      Course.aggregate([
        { $group: { _id: null, totalCount: { $sum: "$count" } } }
      ]).allowDiskUse(true), // Enable disk usage for large aggregations
      User.estimatedDocumentCount(),
      Order.estimatedDocumentCount(),
    ]);

    const totalVideos = totalVideosCount[0]?.totalCount || 0;

    const tabsData = [
      { id: 1, title: "Users signed up", count: usersCount },
      { id: 2, title: "Courses Enrolled", count: orderCount },
      { id: 3, title: "Courses", count: totalCourses },
      { id: 4, title: "Videos", count: totalVideos },
    ];

    return NextResponse.json({ success: true, tabsData });
  } catch (error) {
    console.error("Error in getAdminAnalytics:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}