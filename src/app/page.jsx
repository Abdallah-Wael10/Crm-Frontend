"use client";
import { useState } from "react";
import { useLoginMutation } from "./services/apis/authApi";
import { setAuthToken } from "./utils/page";
import { useRouter } from "next/navigation";
import Image from "next/image";
export default function Home() {
  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(form).unwrap();
      setAuthToken(res.access_token);
      const payload = JSON.parse(atob(res.access_token.split(".")[1]));
      if (payload.role === "admin") {
        router.push("/pages/admin/dashboard-admin");
      } else {
        router.push("/pages/user/dashboard-user");
      }
    } catch (err) {
      setError(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex text-black items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-blue-700">CRM Login</h2>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Please login to your account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-150"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div className="text-red-600 text-sm text-center mt-2 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Forgot your password?{" "}
          <a href="/pages/forget-password" className="text-blue-600 hover:underline">
            Reset here
          </a>
        </div>
      </div>
    </div>
  );
}
