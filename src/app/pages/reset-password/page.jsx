"use client";
import React, { useState, useEffect } from "react";
import { useResetPasswordMutation } from "@/app/services/apis/authApi";
import { toast, Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
const ResetPassword = () => {
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();
  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!code) {
      toast.error("Code is required.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    try {
      await resetPassword({ email, code, newPassword }).unwrap();
      toast.success("Password reset successfully! You can now login.");
      setCode("");
      setNewPassword("");
      router.push(`/`);
    } catch (err) {
      toast.error(err?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="min-h-screen text-black flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <Toaster position="top-center" />
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Reset Password
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex text-black flex-col gap-4"
        >
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
          />
          <input
            type="text"
            placeholder="Code from email"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
          />
          <input
            type="password"
            placeholder="New Password (min 6 chars)"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 w-full shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
