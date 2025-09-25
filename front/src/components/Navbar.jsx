import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-gray-500 font-semibold text-white"
      : "";

  return (
    <nav>
      {/* Mobile menu top bar */}
      <div className="bg-white shadow-lg fixed w-full z-50">
        <div className="max-w-[94%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Hamburger button */}
            <button
              onClick={() => setOpen(prev => !prev)}
              className="cursor-pointer lg:hidden flex items-center"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Title */}
            <div className="text-xl font-bold flex-1 text-center">
              Vanness Plus Consulting
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Slide Menu */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          {/* overlay */}
          <div
            className="fixed inset-0"
            onClick={() => setOpen(false)}
          ></div>

          {/* menu */}
          <div className="relative bg-white w-64 h-full shadow-xl flex flex-col justify-between p-4">
            {/* Menu items */}
            <div>
              <h3 className="text-xl text-center font-bold mb-4">
                Clicknext
              </h3>
              <hr className="my-4" />
              <ul className="space-y-2 text-center">
                <li>
                  <Link
                    to="/"
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2 rounded text-xl hover:bg-gray-200 ${isActive(
                      "/"
                    )}`}
                  >
                    AddExpense
                  </Link>
                </li>
                <li>
                  <Link
                    to="/expenselist"
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2 rounded text-xl hover:bg-gray-200 ${isActive(
                      "/expenselist"
                    )}`}
                  >
                    ExpenseList
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className={`block px-3 py-2 rounded text-xl hover:bg-gray-200 ${isActive(
                      "/dashboard"
                    )}`}
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="w-full bg-gray-300 py-2 rounded hover:bg-gray-400 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar Menu */}
      <div className="hidden lg:flex fixed top-16 left-0 w-64 h-full bg-white shadow-md flex-col p-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={`block px-3 py-2 rounded hover:bg-gray-200 ${isActive(
                "/"
              )}`}
            >
              AddExpense
            </Link>
          </li>
          <li>
            <Link
              to="/expenselist"
              className={`block px-3 py-2 rounded hover:bg-gray-200 ${isActive(
                "/expenselist"
              )}`}
            >
              ExpenseList
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded hover:bg-gray-200 ${isActive(
                "/dashboard"
              )}`}
            >
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
