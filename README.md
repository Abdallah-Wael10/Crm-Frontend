# 📊 CRM Frontend


<p align="center">
  <strong>Modern CRM Frontend built with Next.js, Redux Toolkit, and Tailwind CSS</strong>
</p>

---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Installation](#-installation)
- [🔧 Environment Variables](#-environment-variables)
- [📦 Project Structure](#-project-structure)
- [🔗 API Integration](#-api-integration)
- [🖥️ Pages & Components](#-pages--components)
- [📝 Development](#-development)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📞 Support](#-support)

---

## 🌟 Overview

This CRM frontend is a robust, scalable, and user-friendly interface for managing customers, deals, tasks, and users. Built with Next.js and Redux Toolkit, it provides seamless integration with your backend, real-time dashboards, and a modern UI.

---

## ✨ Features

- 🔐 Authentication (login, password reset)
- 🧑‍💼 Role-based dashboards (Admin/User)
- 📋 Customer management (CRUD)
- 📈 Dashboard charts (admin/user)
- 💼 Deals & tasks management
- 👥 User management (admin)
- ⚡ Fast API integration via Redux Toolkit Query
- 🎨 Responsive design with Tailwind CSS
- 🍪 JWT token management via cookies
- 🔔 Toast notifications for actions
- 🛡️ Protected routes and error handling

---

## 🛠️ Tech Stack

| Technology         | Purpose                |
|--------------------|------------------------|
| **Next.js**        | React Framework        |
| **Redux Toolkit**  | State/API Management   |
| **RTK Query**      | API Calls              |
| **Tailwind CSS**   | Styling                |
| **Chart.js**       | Data Visualization     |
| **React Hot Toast**| Notifications          |
| **js-cookie**      | JWT Token Storage      |

---

## 🚀 Installation

### Prerequisites

- Node.js v16+
- npm

### Setup

```bash
git clone <repository-url>
cd crm-frontend
npm install
cp .env.example .env
# Edit .env with your backend API URL
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📦 Project Structure

```
crm-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── adminChart/
│   │   │   ├── asideAdmin/
│   │   │   ├── asideUser/
│   │   │   ├── loading/
│   │   │   └── userChart/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Customers/
│   │   │   │   ├── dashboard-admin/
│   │   │   │   ├── deals/
│   │   │   │   ├── tasks/
│   │   │   │   └── users/
│   │   │   ├── forget-password/
│   │   │   ├── reset-password/
│   │   │   ├── user/
│   │   │   │   ├── customers/
│   │   │   │   ├── dashboard-user/
│   │   │   │   ├── deals/
│   │   │   │   └── tasks/
│   │   ├── redux/
│   │   │   └── store/
│   │   │       └── store.js
│   │   ├── services/
│   │   │   ├── ClientProvider.js
│   │   │   └── apis/
│   │   │       ├── authApi.js
│   │   │       ├── CustomerApi.js
│   │   │       ├── dashboardUserApi.js
│   │   │       ├── dealsApi.js
│   │   │       ├── tasksApi.js
│   │   │       └── usersApi.js
│   │   ├── utils/
│   │   │   └── page.jsx
│   │   ├── layout.js
│   │   └── page.jsx
├── .env
├── package.json
├── tailwind.config.js
└── next.config.mjs
```

---

## 🔗 API Integration

All API calls are managed via Redux Toolkit Query in `src/app/services/apis/`:

- **authApi.js**: Login, register, password reset
- **CustomerApi.js**: CRUD for customers
- **dashboardUserApi.js**: User dashboard data
- **dealsApi.js**: Deals management
- **tasksApi.js**: Tasks management
- **usersApi.js**: Admin user management

APIs are injected into the Redux store in [`store.js`](src/app/redux/store/store.js):

```javascript
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../services/apis/authApi";
import { dashboardUserApi } from "@/app/services/apis/dashboardUserApi";
import { customerApi } from "../../services/apis/CustomerApi";
import { dealsApi } from "../../services/apis/dealsApi";
import { tasksApi } from "@/app/services/apis/tasksApi";
import { usersApi } from "@/app/services/apis/usersApi";

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
```

---

## 🖥️ Pages & Components

### Main Pages

- `/` — Login page ([page.jsx](src/app/page.jsx))
- `/pages/admin/dashboard-admin` — Admin dashboard
- `/pages/admin/Customers` — Manage customers (admin)
- `/pages/admin/deals` — Manage deals (admin)
- `/pages/admin/tasks` — Manage tasks (admin)
- `/pages/admin/users` — Manage users (admin)
- `/pages/user/dashboard-user` — User dashboard
- `/pages/user/customers` — Manage customers (user)
- `/pages/user/deals` — Manage deals (user)
- `/pages/user/tasks` — Manage tasks (user)
- `/pages/forget-password` — Forgot password
- `/pages/reset-password` — Reset password

### Components

- **adminChart/**, **userChart/** — Dashboard charts
- **asideAdmin/**, **asideUser/** — Sidebar navigation
- **loading/** — Loading spinners

### Utilities

- [`utils/page.jsx`](src/app/utils/page.jsx): JWT token management (set, get, remove) via cookies

### Providers

- [`ClientProvider.js`](src/app/services/ClientProvider.js): Redux store and toast notifications

---

## 📝 Development

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see the [LICENSE](LICENSE) file.

---

## 📞 Support
