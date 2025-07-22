"use client";
import { useState, useEffect } from "react";
import { useGetDashboardQuery } from "../../../services/apis/dashboardUserApi";
import { useGetMeQuery } from "../../../services/apis/authApi";
import Loading from "@/app/components/loading/page";
import { getAuthToken } from "@/app/utils/page";
import { useRouter } from "next/navigation";
import UserChart from "@/app/components/userChart/page";
import AsideUser from "@/app/components/asideUser/page";

export default function DashboardUserPage() {
  const [openAside, setOpenAside] = useState(false);

  const { data: dashboard, error, isLoading } = useGetDashboardQuery();
  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!getAuthToken()) router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 flex w-full">
      <AsideUser user={user} open={openAside} setOpen={setOpenAside} />
      <section className="w-full flex justify-center items-center">
        <main className="w-[80%] h-max flex flex-col items-center justify-start gap-6 ">
          {(isLoading || userLoading) && <Loading />}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-2">
              Welcome to Your CRM Dashboard
            </h2>
            <p className="text-gray-500 text-base mb-4">
              Here you can track your customers, deals, and tasks in real time.
            </p>
          </div>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2 mb-4 text-center">
              {error?.data?.message || "Failed to load dashboard"}
            </div>
          )}
          {dashboard && (
            <>
              <div className="w-full flex justify-center mb-8">
                <div className="w-full md:w-[70%]">
                  <UserChart stats={dashboard} />
                </div>
              </div>
              <div className="bg-white w-full rounded-xl shadow p-6 ">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {dashboard.totalCustomers}
                    </div>
                    <div className="text-gray-600">Customers</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {dashboard.totalDeals}
                    </div>
                    <div className="text-gray-600">Deals</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {dashboard.wonDeals}
                    </div>
                    <div className="text-gray-600">Won Deals</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {dashboard.lostDeals}
                    </div>
                    <div className="text-gray-600">Lost Deals</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {dashboard.pendingDeals}
                    </div>
                    <div className="text-gray-600">Pending Deals</div>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-600">
                      {dashboard.openTasks}
                    </div>
                    <div className="text-gray-600">Open Tasks</div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {dashboard.doneTasks}
                    </div>
                    <div className="text-gray-600">Done Tasks</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </section>
    </div>
  );
}
