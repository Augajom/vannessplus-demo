import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddExpense from "./components/pages/AddExpense";
import ExpenseList from "./components/pages/ExpenseList";
import Dashboard from "./components/pages/Dashboard";

// Layout รวม Navbar + Outlet
function MainLayout() {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 ml-0 lg:ml-64 mt-16 p-4">
        <Outlet />
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <AddExpense />,
      },
      {
        path: "/expenselist",
        element: <ExpenseList />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
