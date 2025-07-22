"use client";
import React, { useState, useEffect } from "react";
import AsideAdmin from "@/app/components/asideAdmin/page";
import Loading from "@/app/components/loading/page";
import { toast, Toaster } from "react-hot-toast";
import { useGetMeQuery } from "../../../services/apis/authApi";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/app/services/apis/usersApi";
import { getAuthToken } from "@/app/utils/page";
import { useRouter } from "next/navigation";

const initialForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  role: "user",
};

const UsersAdmin = () => {
  const router = useRouter();
  useEffect(() => {
    if (!getAuthToken()) router.push("/");
  }, [router]);

  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const { data: users, isLoading: usersLoading, error } = useGetUsersQuery();
  const [addUser, { isLoading: addLoading }] = useAddUserMutation();
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();
  const [openAside, setOpenAside] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");

  const isAnyLoading =
    userLoading || usersLoading || addLoading || updateLoading || deleteLoading;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    toast.loading(editId ? "Updating user..." : "Creating user...", {
      id: "userAction",
    });
    try {
      if (editId) {
        await updateUser({ id: editId, ...form }).unwrap();
        toast.success("User updated successfully!", { id: "userAction" });
      } else {
        await addUser(form).unwrap();
        toast.success("User created successfully!", { id: "userAction" });
      }
      setForm(initialForm);
      setEditId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Error occurred", { id: "userAction" });
      setFormError(err?.data?.message || "Error occurred");
    }
  };

  const handleEdit = (user) => {
    setForm({
      username: user.username || "",
      email: user.email || "",
      password: "",
      role: user.role || "user",
    });
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    setFormError("");
    toast.loading("Deleting user...", { id: "userDelete" });
    try {
      if (window.confirm("Are you sure you want to delete this user?")) {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully!", { id: "userDelete" });
      } else {
        toast.dismiss("userDelete");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Error occurred", { id: "userDelete" });
      setFormError(err?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 flex w-full relative">
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
              Users Dashboard
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4 items-center mb-4"
            >
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={form.username}
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
                name="password"
                type="password"
                placeholder={editId ? "New Password (optional)" : "Password"}
                value={form.password}
                onChange={handleChange}
                required={!editId}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
              />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition"
                disabled={addLoading || updateLoading}
              >
                {editId ? "Update" : "Create"}
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
                {error?.data?.message || "Failed to load users"}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users?.length === 0 && (
                <div className="col-span-2 text-center py-4 text-gray-400">
                  No users found.
                </div>
              )}
              {users?.map((u) => (
                <div
                  key={u._id}
                  className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 transition hover:shadow-lg"
                >
                  <div className="font-bold text-lg text-blue-700">
                    {u.username}{" "}
                    <span className="text-xs text-gray-400">({u.email})</span>
                  </div>
                  <div className="text-gray-600">Name: {u.username}</div>
                  <div className="text-gray-600">
                    Role:{" "}
                    <span
                      className={`font-semibold px-2 py-1 rounded ${
                        u.role === "admin"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition"
                      onClick={() => handleEdit(u)}
                      disabled={updateLoading}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                      onClick={() => handleDelete(u._id)}
                      disabled={deleteLoading}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Added:{" "}
                    {new Date(u.createdAt).toLocaleString("en-US", {
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

export default UsersAdmin;
