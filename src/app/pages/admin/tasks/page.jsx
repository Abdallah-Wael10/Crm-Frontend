"use client";
import React, { useState, useEffect } from "react";
import AsideAdmin from "@/app/components/asideAdmin/page";
import Loading from "@/app/components/loading/page";
import { toast, Toaster } from "react-hot-toast";
import { useGetMeQuery } from "../../../services/apis/authApi";
import {
  useGetTasksQuery,
  useAssignTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/app/services/apis/tasksApi";
import { useGetUsersQuery } from "@/app/services/apis/usersApi";
import { getAuthToken } from "@/app/utils/page";
import { useRouter } from "next/navigation";

const initialForm = {
  title: "",
  status: "pending",
  dueDate: "",
  assignedTo: "",
};

const TasksAdmin = () => {
  const router = useRouter();
  useEffect(() => {
    if (!getAuthToken()) router.push("/");
  }, [router]);

  const { data: user, isLoading: userLoading } = useGetMeQuery();
  const { data: tasks, error, isLoading, isFetching } = useGetTasksQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const [assignTask, { isLoading: assignLoading }] = useAssignTaskMutation();
  const [updateTask, { isLoading: updateLoading }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: deleteLoading }] = useDeleteTaskMutation();
  const [openAside, setOpenAside] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");

  const isAnyLoading =
    isLoading ||
    isFetching ||
    userLoading ||
    usersLoading ||
    assignLoading ||
    updateLoading ||
    deleteLoading;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    toast.loading(editId ? "Updating task..." : "Assigning task...", {
      id: "taskAction",
    });
    try {
      if (editId) {
        await updateTask({ id: editId, ...form }).unwrap();
        toast.success("Task updated successfully!", { id: "taskAction" });
      } else {
        await assignTask(form).unwrap();
        toast.success("Task assigned successfully!", { id: "taskAction" });
      }
      setForm(initialForm);
      setEditId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Error occurred", { id: "taskAction" });
      setFormError(err?.data?.message || "Error occurred");
    }
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      status: task.status,
      dueDate: task.dueDate?.slice(0, 10) || "",
      assignedTo: task.assignedTo,
    });
    setEditId(task._id);
  };

  const handleDelete = async (id) => {
    setFormError("");
    toast.loading("Deleting task...", { id: "taskDelete" });
    try {
      if (window.confirm("Are you sure you want to delete this task?")) {
        await deleteTask(id).unwrap();
        toast.success("Task deleted successfully!", { id: "taskDelete" });
      } else {
        toast.dismiss("taskDelete");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Error occurred", { id: "taskDelete" });
      setFormError(err?.data?.message || "Error occurred");
    }
  };

  const getAssignedToName = (task) => {
    if (!users) return task.assignedTo;
    const assignedUser = users.find((u) => u._id === task.assignedTo);
    return assignedUser ? assignedUser.username : task.assignedTo;
  };

  const getCreatorName = (task) => {
    if (!users) return task.createdBy;
    const creator = users.find((u) => u._id === task.createdBy);
    if (creator) {
      if (creator.role === "admin") {
        return `Created by admin ${creator.username}`;
      }
      return `Created by ${creator.username}`;
    }
    return "Created by unknown";
  };

  const getStatusColor = (status) => {
    if (status === "pending") return "bg-yellow-50 border-yellow-200";
    if (status === "done") return "bg-green-50 border-green-200";
    if (status === "open") return "bg-blue-50 border-blue-200";
    return "bg-gray-50 border-gray-200";
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
              All Tasks
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
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
              >
                <option value="pending">Pending</option>
                <option value="open">Open</option>
                <option value="done">Done</option>
              </select>
              <input
                name="dueDate"
                type="date"
                placeholder="Due Date"
                value={form.dueDate}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
              />
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
              >
                <option value="">Assign to user</option>
                {users?.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition"
                disabled={assignLoading || updateLoading}
              >
                {editId ? "Update" : "Assign"}
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
                {error?.data?.message || "Failed to load tasks"}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks?.length === 0 && (
                <div className="col-span-2 text-center py-4 text-gray-400">
                  No tasks found.
                </div>
              )}
              {tasks?.map((task) => (
                <div
                  key={task._id}
                  className={`border ${getStatusColor(
                    task.status
                  )} rounded-2xl shadow p-6 flex flex-col gap-2 transition hover:shadow-lg`}
                >
                  <div className="font-bold text-lg text-blue-700">
                    {task.title}
                  </div>
                  <div className="text-gray-600">
                    Status:{" "}
                    <span
                      className={`px-3 py-1 rounded-full font-semibold ${
                        task.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : task.status === "open"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Due Date:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </div>
                  <div className="text-gray-600">
                    Assigned To:{" "}
                    <span className="font-semibold">
                      {getAssignedToName(task)}
                    </span>
                  </div>
                  <div className="text-gray-600">{getCreatorName(task)}</div>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition"
                      onClick={() => handleEdit(task)}
                      disabled={updateLoading}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                      onClick={() => handleDelete(task._id)}
                      disabled={deleteLoading}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Added:{" "}
                    {new Date(task.createdAt).toLocaleString("en-US", {
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

export default TasksAdmin;
