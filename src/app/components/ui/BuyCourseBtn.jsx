"use client";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from "react-hot-toast";
import PrimaryButton from "./PrimaryButton";

export default function BuyCourseBtn({ userData, courseData, id, userSession }) {
    const [loading, setLoading] = useState(false); // ⬅️ Added loading state

    const router = useRouter();

    const buyCourse = async () => {

        if (!userData) {
            router.push("/dashboard/settings");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/orders", {
                amount: courseData.price,
                courseId: id,
                userData: { ...userData, email: userSession?.email },
                userId: userSession?.id,
            });
            toast.success(response.data.message);
            window.open(response.data.data);
            // return response;
        } catch (error) {
            console.log(error);
            if (error.response) {
                // If the error has a response, check the status code
                if (error.response.status === 403) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.response.status, error.response.data);
                }
            } else {
                toast.error("Network error or request failed:", error.message);
                setLoading(false);
            }
        }
    };

    return (
        <PrimaryButton
            onClick={buyCourse}
            disabled={loading} // ⬅️ Disable button when loading
            type="button"
            className="border cursor-pointer w-full rounded-lg py-2 transition-all shadow-md hover:shadow-xl text-white bg-[#2196f3] hover:bg-blue-600"
        >
            {loading ? "Processing..." : "Buy Course"}
        </PrimaryButton>

    )
}
