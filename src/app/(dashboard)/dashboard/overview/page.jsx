import Image from "next/image";
import React from "react";
import { getServerSession } from "next-auth";
import AdminPanel from "@/src/app/components/AdminPanel";
import AdminAnalyticsSection from "@/src/app/components/dashboardComponents/AdminAnalyticsSection";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import UserAnalyticsSection from "@/src/app/components/dashboardComponents/UserAnalyticsSection";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen p-5">
      <div className="flex justify-between items-center bg-white shadow-lg p-8 rounded-xl">
        <div>
          <h4 className="text-2xl mb-2 font-semibold">
            Welcome, {session?.user?.name}
          </h4>
          <p className="text-slate-600">
            {session?.user?.role === "admin"
              ? "Track your users and manage your courses"
              : "Track your progress and manage your courses"}
          </p>
        </div>

        <div>
          <Image
            src={session?.user?.image}
            alt={session?.user?.name}
            width={40}
            height={40}
            className="rounded-full aspect-square object-cover"
          />
        </div>
      </div>

      {session?.user?.role === "admin" && (
        <div className="mt-10 bg-white py-5 px-8 rounded-xl shadow-lg">
          <AdminPanel />
        </div>
      )}

      {session?.user?.role === "admin" ? (
        <AdminAnalyticsSection session={session} />
      ) : (
        <UserAnalyticsSection session={session} />
      )}
    </div>
  );
}
