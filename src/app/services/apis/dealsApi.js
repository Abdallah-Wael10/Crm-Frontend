import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../../utils/page";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const dealsApi = createApi({
  reducerPath: "dealsApi",
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
  tagTypes: ["Deals"],
  endpoints: (builder) => ({
    getDeals: builder.query({
      query: () => ({
        url: "/api/deals",
        method: "GET",
      }),
      providesTags: ["Deals"],
    }),
    getDeal: builder.query({
      query: (id) => ({
        url: `/api/deals/${id}`,
        method: "GET",
      }),
    }),
    addDeal: builder.mutation({
      query: (body) => ({
        url: "/api/deals",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Deals"],
    }),
    updateDeal: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/deals/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Deals"],
    }),
    deleteDeal: builder.mutation({
      query: (id) => ({
        url: `/api/deals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Deals"],
    }),
  }),
});

export const {
  useGetDealsQuery,
  useGetDealQuery,
  useAddDealMutation,
  useUpdateDealMutation,
  useDeleteDealMutation,
} = dealsApi;
