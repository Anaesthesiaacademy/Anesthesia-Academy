import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { UserDetailsForm } from "@/src/app/forms/UserDetailsForm";
import connectToDatabase from "@/src/app/lib/connectToDb";
import { User } from "@/src/app/models/User";
import { getServerSession } from "next-auth";
import React from "react";

export default async function Settings() {
  const session = await getServerSession(authOptions);
  await connectToDatabase();

  const userData = await User.findById({ _id: session.user.id }, "userData").lean();

  return (
    <div>
      <div>
        <h5 className="text-2xl font-bold pl-3 mt-4">Payment Details</h5>
      </div>
      <UserDetailsForm userData={userData.userData} email={session.user.email} />
    </div>
  );
}
