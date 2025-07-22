"use client";
import React, { useState ,useEffect} from "react";
import { useGetMeQuery } from "../../../services/apis/authApi";
import { useGetCustomersQuery } from "@/app/services/apis/CustomerApi";
import {
  useGetDealsQuery,
  useAddDealMutation,
  useUpdateDealMutation,
  useDeleteDealMutation,
} from "@/app/services/apis/dealsApi";
import Loading from "@/app/components/loading/page";
import AsideUser from "@/app/components/asideUser/page";
import { toast, Toaster } from "react-hot-toast";
import { getAuthToken } from "@/app/utils/page";
import { useRouter } from "next/navigation";

const initialForm = {
  title: "",
  amount: "",
  status: "pending",
  customerId: "",
};

const Deals = () => {
  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const { data: customers, isLoading: customersLoading } =
    useGetCustomersQuery();
  const { data: deals, error, isLoading, isFetching } = useGetDealsQuery();
  const [addDeal, { isLoading: addLoading }] = useAddDealMutation();
  const [updateDeal, { isLoading: updateLoading }] = useUpdateDealMutation();
  const [deleteDeal, { isLoading: deleteLoading }] = useDeleteDealMutation();
  const [openAside, setOpenAside] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");

    const router = useRouter();
  
    useEffect(() => {
      if (!getAuthToken()) router.push("/");
    }, [router]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    toast.loading(editId ? "Updating deal..." : "Adding deal...", {
      id: "dealAction",
    });
    try {
      if (editId) {
        await updateDeal({ id: editId, ...form }).unwrap();
        toast.success("Deal updated successfully!", { id: "dealAction" });
      } else {
        await addDeal(form).unwrap();
        toast.success("Deal added successfully!", { id: "dealAction" });
      }
      setForm(initialForm);
      setEditId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Error occurred", { id: "dealAction" });
      setFormError(err?.data?.message || "Error occurred");
    }
  };

  const handleEdit = (deal) => {
    setForm({
      title: deal.title,
      amount: deal.amount,
      status: deal.status,
      customerId: deal.customerId,
    });
    setEditId(deal._id);
  };

  const handleDelete = async (id) => {
    setFormError("");
    toast.loading("Deleting deal...", { id: "dealDelete" });
    try {
      if (window.confirm("Are you sure you want to delete this deal?")) {
        await deleteDeal(id).unwrap();
        toast.success("Deal deleted successfully!", { id: "dealDelete" });
      } else {
        toast.dismiss("dealDelete");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Error occurred", { id: "dealDelete" });
      setFormError(err?.data?.message || "Error occurred");
    }
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "bg-yellow-50 border-yellow-200";
    if (status === "won") return "bg-green-50 border-green-200";
    if (status === "lost") return "bg-red-50 border-red-200";
    return "bg-gray-50 border-gray-200";
  };

  const isAnyLoading =
    isLoading ||
    isFetching ||
    addLoading ||
    updateLoading ||
    deleteLoading ||
    customersLoading ||
    userLoading;

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 flex w-full relative">
      {isAnyLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70">
          <Loading />
        </div>
      )}
      <AsideUser user={user} open={openAside} setOpen={setOpenAside} />
      <section className="flex-1 flex justify-center items-start">
        <main className="w-full md:w-[70%] max-w-2xl mx-auto flex flex-col items-center">
          <button
            className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white rounded-full p-2 shadow-lg"
            onClick={() => setOpenAside(!openAside)}
            aria-label="Toggle Sidebar"
          >
            {openAside ? "✖" : "☰"}
          </button>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full mb-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-tight">
              Deals
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4 items-center mb-4"
            >
              <input
                name="title"
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
              />
              <input
                name="amount"
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
              >
                <option value="pending">Pending</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              <select
                name="customerId"
                value={form.customerId}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
              >
                <option value="">Select Customer</option>
                {customers?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition"
                disabled={addLoading || updateLoading}
              >
                {editId ? "Update" : "Add"}
              </button>
            </form>
            {formError && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2 mb-2 text-center">
                {formError}
              </div>
            )}
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
                    {customers?.find((c) => c._id === deal.customerId)?.name ||
                      "Unknown"}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition"
                      onClick={() => handleEdit(deal)}
                      disabled={updateLoading}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                      onClick={() => handleDelete(deal._id)}
                      disabled={deleteLoading}
                    >
                      Delete
                    </button>
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

export default Deals;
