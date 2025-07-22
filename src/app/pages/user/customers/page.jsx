"use client";
import React, { useState ,useEffect} from "react";
import {
  useGetCustomersQuery,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "@/app/services/apis/CustomerApi";
import { useGetMeQuery } from "../../../services/apis/authApi";
import Loading from "@/app/components/loading/page";
import AsideUser from "@/app/components/asideUser/page";
import { getAuthToken } from "@/app/utils/page";
import { useRouter } from "next/navigation";

const initialForm = { name: "", email: "", phone: "" };

const CustomersPage = () => {
  const { data, error, isLoading } = useGetCustomersQuery();
  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const [addCustomer] = useAddCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();
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
    try {
      if (editId) {
        await updateCustomer({ id: editId, ...form }).unwrap();
      } else {
        await addCustomer(form).unwrap();
      }
      setForm(initialForm);
      setEditId(null);
    } catch (err) {
      setFormError(err?.data?.message || "Error occurred");
    }
  };

  const handleEdit = (customer) => {
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });
    setEditId(customer._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      await deleteCustomer(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 flex w-full">
      {/* Aside on the left, togglable on mobile */}
      <AsideUser user={user} open={openAside} setOpen={setOpenAside} />
      {/* Main content centered and responsive */}
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
              Customers
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col text-black md:flex-row gap-4 items-center mb-4"
            >
              <input
                name="name"
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
              />
              <input
                name="phone"
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition"
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
            {isLoading && <Loading />}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2 mb-2 text-center">
                {error?.data?.message || "Failed to load customers"}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data?.length === 0 && (
                <div className="col-span-2 text-center py-4 text-gray-400">
                  No customers found.
                </div>
              )}
              {data?.map((customer) => (
                <div
                  key={customer._id}
                  className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 transition hover:shadow-lg"
                >
                  <div className="font-bold text-lg text-blue-700">
                    {customer.name}
                  </div>
                  <div className="text-gray-600">{customer.email}</div>
                  <div className="text-gray-600">{customer.phone}</div>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition"
                      onClick={() => handleEdit(customer)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                      onClick={() => handleDelete(customer._id)}
                    >
                      Delete
                    </button>
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

export default CustomersPage;
