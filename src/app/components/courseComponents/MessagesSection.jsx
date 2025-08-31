"use client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { stateOfOrderReq } from "../../actions/pageActions";
import Modal from "./Modal";
import Image from "next/image";
import Link from "next/link";
import PrimaryButton from "../ui/PrimaryButton";
import axios from "axios";

export default function MessagesSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [stateLoading, setStateLoading] = useState(false);
  const [configModal, setConfigModal] = useState({
    isOpen: false,
    messageId: null,
  });

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["survey-messages", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `/api/getSurveyMessages?limit=5`
      );
      const data = await res.json();
      if (!res.ok || data.message !== "Success") {
        throw new Error(data.message || "Failed to fetch messages");
      }
      return data;
    },
    enabled: !!currentPage,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const evtSource = new EventSource("/api/stream/surveyMessages");

    evtSource.onmessage = (event) => {
      const newMsg = JSON.parse(event.data);
      if (!newMsg) return;
      toast.success("New message received!");
      queryClient.invalidateQueries(["survey-messages", currentPage]);
    };

    evtSource.onerror = () => evtSource.close();

    return () => evtSource.close();
  }, [currentPage, queryClient]);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < (data?.pagination?.totalPages || 1)) {
      setCurrentPage((prev) => prev + 1);
    }
  };


  const updateState = async (id, status) => {
    try {
      if (!id) return;
      setStateLoading(true);

      // Wrap the promise inside toast.promise
      const result = await toast.promise(
        stateOfOrderReq({ id, status }),
        {
          loading: "Updating order...",
          success: (res) => res.message || "Order updated successfully!",
          error: (err) => err.message || "Failed to update order",
        }
      );

      queryClient.invalidateQueries(["survey-messages", currentPage]);

      if (result.success) {
        // send email to user
        const emailRes = await axios.post("/api/cron-job/sendEmail", {
          to: result.data.email,
          subject: "Your Order Request in course eilajshamil has been Update",
          message: status === "approved" ? `Your order request has been ${status}. Thank you for your patience!
           go to the course page to see the details: ${process.env.NEXT_PUBLIC_BASE_URL}/course/${result.data.courseId}
          ` :
            `Your order request has been ${status}. Thank you for your patience!`,
        });

        console.log("Email response:", emailRes.data);


        if (!emailRes.data.success) {
          toast.error("Failed to send confirmation email. Please send email manually to dr.nabil2025@gmail.com.");
          return;
        }
      }

    } catch (error) {
      // This will still run if something throws outside of the promise
      console.error("Error updating state:", error);
    } finally {
      setStateLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-6 gap-6 bg-white w-full mt-4 text-slate-900">
      <h3 className="font-bold text-center">Orders Requests</h3>
      {isLoading && <p>Loading orders...</p>}
      {isError && <p className="text-red-500">Failed to load orders.</p>}

      {data?.data?.map((msg) => (
        <div
          key={msg._id}
          className="w-full p-4 border rounded shadow max-w-lg bg-white"
        >
          <h4 className="font-semibold mb-2"> from: {msg.name}</h4>
          <h3 className="font-extralight text-slate-400 text-sm mb-2">{formatDistanceToNow(msg.createdAt)}</h3>
          <Link href={`/api/upload/proxyImage?key=${encodeURIComponent(msg.screenshot.cloudId)}`} target="_blank" className="relative w-12">
            <Image
              src={`/api/upload/proxyImage?key=${encodeURIComponent(msg.screenshot.cloudId)}`}
              alt="User Avatar"
              width={48}
              height={48}
              quality={70}
              className="rounded-full object-cover aspect-square"
            />
          </Link>

          {/* Loop over itemsMessage object */}
          <div className="space-y-1 text-sm">
            <div className="font-bold">email: <span>{msg.email}</span></div>
            <div className="text-slate-600">message: <span>{msg.message}</span></div>
            <div className="text-slate-600">phone: <span>{msg.phone}</span></div>
            <div className="text-slate-600">payment Number: <span>{msg.paymentNumber}</span></div>
            <div className="text-slate-600">payment Method: <span>{msg.paymentMethod}</span></div>
          </div>

          <div className="w-full flex justify-between mt-4 gap-4">
            <PrimaryButton
              disabled={isLoading || stateLoading}
              onClick={() => updateState(msg._id, "approved")}
              className="text-green-500 text-sm"
            >
              {stateLoading ? "Accepting..." : "Accept"}
            </PrimaryButton>
            <PrimaryButton
              disabled={isLoading || stateLoading}
              onClick={() => setConfigModal({ isOpen: true, messageId: msg._id })}
              className="text-red-500 text-sm"
            >
              {stateLoading ? "Refusing..." : "Refuse"}
            </PrimaryButton>
          </div>
        </div>
      ))}

      {data?.pagination?.totalPages > 1 && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="text-blue-500 disabled:text-gray-400"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage >= data.pagination.totalPages}
            className="text-blue-500 disabled:text-gray-400"
          >
            Next
          </button>
        </div>
      )}

      {/* delete confirm modal */}
      <Modal isOpen={configModal.isOpen} onClose={() => setConfigModal({ isOpen: false, messageId: null })} >
        <div className="p-4">
          <h3 className="font-bold mb-2">Are you sure you want to Refused this order?</h3>
          <button
            onClick={() => {
              updateState(configModal.messageId, "rejected");
              setConfigModal({ isOpen: false, messageId: null });
            }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Confirm
          </button>
          <button
            onClick={() => setConfigModal({ isOpen: false, messageId: null })}
            className="ml-2 bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
