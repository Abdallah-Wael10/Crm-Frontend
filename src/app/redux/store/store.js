import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../services/apis/authApi";
import { dashboardUserApi } from "@/app/services/apis/dashboardUserApi";
import { customerApi } from "../../services/apis/CustomerApi";
import { dealsApi } from "../../services/apis/dealsApi";
import {tasksApi} from "@/app/services/apis/tasksApi"
import {usersApi} from "@/app/services/apis/usersApi"

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [dashboardUserApi.reducerPath]: dashboardUserApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [dealsApi.reducerPath]: dealsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      dashboardUserApi.middleware,
      customerApi.middleware,
      dealsApi.middleware,
      tasksApi.middleware,
      usersApi.middleware
    ),
});
