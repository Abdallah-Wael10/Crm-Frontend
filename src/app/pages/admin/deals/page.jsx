"use client";
import React, { useState } from "react";
import AsideAdmin from "@/app/components/asideAdmin/page";
import Loading from "@/app/components/loading/page";
import { toast, Toaster } from "react-hot-toast";
import { useGetMeQuery } from "../../../services/apis/authApi";
import { useGetDealsQuery } from "@/app/services/apis/dealsApi";
import { useGetCustomersQuery } from "@/app/services/apis/CustomerApi";
import { useGetUsersQuery } from "@/app/services/apis/usersApi";

const DealsAdmin = () => {
  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const { data: deals, isLoading: dealsLoading, error } = useGetDealsQuery();
  const { data: customers, isLoading: customersLoading } =
    useGetCustomersQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const [openAside, setOpenAside] = useState(false);

  const isAnyLoading =
    userLoading || dealsLoading || customersLoading || usersLoading;

  // دالة تجيب اسم العميل
  const getCustomerName = (deal) => {
    if (!customers) return deal.customerId;
    const customer = customers.find((c) => c._id === deal.customerId);
    return customer ? customer.name : deal.customerId;
  };

  // دالة تجيب username الخاص بالمستخدم اللي عمل الديل
  const getUserUsername = (deal) => {
    if (!users) return deal.userId;
    const u = users.find((user) => user._id === deal.userId);
    return u ? u.username : deal.userId;
  };

  // دالة لون الكارت حسب status
  const getStatusColor = (status) => {
    if (status === "pending") return "bg-yellow-50 border-yellow-200";
    if (status === "won") return "bg-green-50 border-green-200";
    if (status === "lost") return "bg-red-50 border-red-200";
    return "bg-gray-50 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 flex w-full relative">
      <Toaster position="top-center" />
      {isAnyLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70">
          <Loading />
        </div>
      )}
      <AsideAdmin user={user} open={openAside} setOpen={setOpenAside} />
      <section className="flex-1 flex justify-center items-start">
        <main className="w-full md:w-[70%] max-w-4xl mx-auto flex flex-col items-center">
          <button
            className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white rounded-full p-2 shadow-lg"
            onClick={() => setOpenAside(!openAside)}
            aria-label="Toggle Sidebar"
          >
            {openAside ? "✖" : "☰"}
          </button>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full mb-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-tight">
              All Deals
            </h2>
            <div className="mb-6 text-center text-gray-600">
              Total Deals:{" "}
              <span className="font-bold text-blue-700">
                {deals?.length || 0}
              </span>
            </div>
          </div>
          <div className="w-full">
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2 mb-2 text-center">
                {error?.data?.message || "Failed to load deals"}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deals?.length === 0 && (
                <div className="col-span-2 text-center py-4 text-gray-400">
                  No deals found.
                </div>
              )}
              {deals?.map((deal) => (
                <div
                  key={deal._id}
                  className={`border ${getStatusColor(
                    deal.status
                  )} rounded-2xl shadow p-6 flex flex-col gap-2 transition hover:shadow-lg`}
                >
                  <div className="font-bold text-lg text-blue-700">
                    {deal.title}
                  </div>
                  <div className="text-gray-600">Amount: {deal.amount}</div>
                  <div className="text-gray-600">
                    Status:{" "}
                    <span
                      className={`px-3 py-1 rounded-full font-semibold ${
                        deal.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : deal.status === "won"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {deal.status.charAt(0).toUpperCase() +
                        deal.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Customer:{" "}
                    <span className="font-semibold">
                      {getCustomerName(deal)}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Posted By:{" "}
                    <span className="font-semibold">
                      {getUserUsername(deal)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Added:{" "}
                    {new Date(deal.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default DealsAdmin;
