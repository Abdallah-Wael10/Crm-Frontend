import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../utils/page";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const dashboardUserApi = createApi({
  reducerPath: "dashboardUserApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => ({
        url: "/api/dashboard",
        method: "GET",
      }),
    }),
    getAdminDashboardAll: builder.query({
      query: () => ({
        url: "/api/dashboard/admin/all",
        method: "GET",
      }),
    }),
    getAdminDashboardById: builder.query({
      query: (id) => ({
        url: `/api/dashboard/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetAdminDashboardAllQuery,
  useGetAdminDashboardByIdQuery,
} = dashboardUserApi;
