"use client"
import React, { useState , useEffect} from "react";
import AsideAdmin from "@/app/components/asideAdmin/page";
import Loading from "@/app/components/loading/page";
import { toast, Toaster } from "react-hot-toast";
import { useGetMeQuery } from "../../../services/apis/authApi";
import { useGetCustomersQuery } from "@/app/services/apis/CustomerApi";
import { useGetUsersQuery } from "@/app/services/apis/usersApi";
import { getAuthToken } from "@/app/utils/page";
import { useRouter } from "next/navigation";

const CustomersAdmin = () => {
  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const {
    data: customers,
    isLoading: customersLoading,
    error,
  } = useGetCustomersQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const [openAside, setOpenAside] = useState(false);

  const isAnyLoading = userLoading || customersLoading || usersLoading;
      const router = useRouter();
    
      useEffect(() => {
        if (!getAuthToken()) router.push("/");
      }, [router]);

  // دالة تجيب اسم المستخدم اللي عمل customer
  const getCreatorName = (customer) => {
    if (!users) return customer.userId;
    const creator = users.find((u) => u._id === customer.userId);
    return creator ? creator.username : customer.userId;
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
        <main className="w-full md:w-[70%] max-w-3xl mx-auto flex flex-col items-center">
          <button
            className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white rounded-full p-2 shadow-lg"
            onClick={() => setOpenAside(!openAside)}
            aria-label="Toggle Sidebar"
          >
            {openAside ? "✖" : "☰"}
          </button>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full mb-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-tight">
              All Customers
            </h2>
            <div className="mb-6 text-center text-gray-600">
              Total Customers:{" "}
              <span className="font-bold text-blue-700">
                {customers?.length || 0}
              </span>
            </div>
          </div>
          <div className="w-full">
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2 mb-2 text-center">
                {error?.data?.message || "Failed to load customers"}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customers?.length === 0 && (
                <div className="col-span-2 text-center py-4 text-gray-400">
                  No customers found.
                </div>
              )}
              {customers?.map((customer) => (
                <div
                  key={customer._id}
                  className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 transition hover:shadow-lg"
                >
                  <div className="font-bold text-lg text-blue-700">
                    {customer.name}
                  </div>
                  <div className="text-gray-600">Email: {customer.email}</div>
                  <div className="text-gray-600">Phone: {customer.phone}</div>
                  <div className="text-gray-600">
                    Added By:{" "}
                    <span className="font-semibold">
                      {getCreatorName(customer)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Added:{" "}
                    {new Date(customer.createdAt).toLocaleString("en-US", {
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

export default CustomersAdmin;
