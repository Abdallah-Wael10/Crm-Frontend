"use client";
import React, { useState } from "react";
import { useForgetPasswordMutation } from "@/app/services/apis/authApi";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      await forgetPassword({ email }).unwrap();
      toast.success("Code sent to your email. Check your inbox!");
      setTimeout(() => {
        router.push(`/pages/reset-password`);
      }, 1200);
    } catch (err) {
      toast.error(err?.data?.message || "Error sending code");
    }
  };

  return (
    <div className="min-h-screen text-black flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <Toaster position="top-center" />
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Forget Password
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition"
          >
            {isLoading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
