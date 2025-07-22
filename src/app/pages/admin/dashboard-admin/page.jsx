"use client";
import { useState , useEffect} from "react";
import { useGetAdminDashboardAllQuery } from "../../../services/apis/dashboardUserApi";
import { useGetMeQuery } from "../../../services/apis/authApi";
import { toast, Toaster } from "react-hot-toast";
import Loading from "@/app/components/loading/page";
import AdminChart from "@/app/components/adminChart/page";
import AsideAdmin from "@/app/components/asideAdmin/page";
import { getAuthToken } from "@/app/utils/page";
import { useRouter } from "next/navigation";

const DashboardAdmin = () => {
  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const { data, error, isLoading, isFetching } = useGetAdminDashboardAllQuery();
  const [openAside, setOpenAside] = useState(false);

  const isAnyLoading = isLoading || isFetching || userLoading;

    const router = useRouter();
  
    useEffect(() => {
      if (!getAuthToken()) router.push("/");
    }, [router]);

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
              Admin Dashboard
            </h2>
            <div className="mb-6 text-center text-gray-600">
              Total Users:{" "}
              <span className="font-bold text-blue-700">
                {data?.length || 0}
              </span>
            </div>
            {data && <AdminChart stats={data} />}
          </div>
          <div className="w-full">
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2 mb-2 text-center">
                {error?.data?.message || "Failed to load dashboard"}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data?.map((item) => (
                <div
                  key={item.user.id}
                  className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 transition hover:shadow-lg"
                >
                  <div className="font-bold text-lg text-blue-700">
                    {item.user.username}{" "}
                    <span className="text-xs text-gray-400">
                      ({item.user.email})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-600 mt-2">
                    <div>
                      Customers:{" "}
                      <span className="font-bold text-blue-700">
                        {item.totalCustomers}
                      </span>
                    </div>
                    <div>
                      Deals:{" "}
                      <span className="font-bold text-blue-700">
                        {item.totalDeals}
                      </span>
                    </div>
                    <div>
                      Won Deals:{" "}
                      <span className="font-bold text-green-700">
                        {item.wonDeals}
                      </span>
                    </div>
                    <div>
                      Lost Deals:{" "}
                      <span className="font-bold text-red-700">
                        {item.lostDeals}
                      </span>
                    </div>
                    <div>
                      Pending Deals:{" "}
                      <span className="font-bold text-yellow-700">
                        {item.pendingDeals}
                      </span>
                    </div>
                    <div>
                      Open Tasks:{" "}
                      <span className="font-bold text-cyan-700">
                        {item.openTasks}
                      </span>
                    </div>
                    <div>
                      Done Tasks:{" "}
                      <span className="font-bold text-indigo-700">
                        {item.doneTasks}
                      </span>
                    </div>
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

export default DashboardAdmin;
