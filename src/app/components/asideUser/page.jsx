import React from "react";
import Link from "next/link";
import { removeAuthToken } from "@/app/utils/page";
const AsideUser = ({ user, open, setOpen }) => {
  return (
    <>
      {/* زر فتح/إغلاق الـ aside */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white rounded-full p-2 shadow-lg"
        onClick={() => setOpen(!open)}
        aria-label="Toggle Sidebar"
      >
        {open ? "✖" : "☰"}
      </button>
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-40 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0 md:flex flex-col rounded-xl p-6 min-w-[220px]`}
        style={{ maxWidth: 260 }}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl mb-2">
            {user?.username?.charAt(0)?.toUpperCase()}
          </div>
          <div className="text-lg font-semibold text-blue-700">
            {user?.username}
          </div>
          <div className="text-sm text-gray-500">
            {user?.email}
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            href="/pages/user/dashboard-user"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-700 font-medium transition"
          >
            Dashboard
          </Link>
          <Link
            href="/pages/user/customers"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-700 font-medium transition"
          >
            Customers
          </Link>
          <Link
            href="/pages/user/deals"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-700 font-medium transition"
          >
            Deals
          </Link>
          <Link
            href="/pages/user/tasks"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 text-blue-700 font-medium transition"
          >
            Tasks
          </Link>

        </nav>
        <div className="mt-8 text-center">
          <button
            className="w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-lg transition"
            onClick={() => {
              removeAuthToken();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AsideUser;
