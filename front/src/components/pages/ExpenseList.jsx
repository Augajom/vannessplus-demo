import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const categories = ["อาหาร", "เดินทาง", "บิล", "บันเทิง", "อื่น ๆ"];

function ExpenseList() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("https://vannessplus-demo.onrender.com/api/expenses/get");
      const formatted = res.data.map((tx) => ({
        ...tx,
        date: dayjs(tx.date).format("YYYY-MM-DD"),
      }));
      setTransactions(formatted);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this expense!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://vannessplus-demo.onrender.com/api/expenses/delete/${id}`);
        setTransactions(transactions.filter((tx) => tx._id !== id));
        Swal.fire("Deleted!", "Your expense has been deleted.", "success");
      } catch (err) {
        console.error("Error deleting expense:", err);
        Swal.fire("Error!", "Failed to delete expense.", "error");
      }
    }
  };

  const handleEdit = async (id) => {
    const tx = transactions.find((tx) => tx._id === id);

    const { value: formValues } = await Swal.fire({
      title: "Edit Expense",
      html: `
      <div class="swal2-content space-y-4">
        <div class="flex items-center gap-3">
          <label for="swal-date" class="font-semibold w-28 text-right shrink-0">Date:</label>
          <input type="date" id="swal-date" class="swal2-input flex-1 min-w-0" value="${dayjs(
            tx.date
          ).format("YYYY-MM-DD")}">
        </div>

        <div class="flex items-center gap-3">
          <label for="swal-category" class="font-semibold w-28 text-right shrink-0">Category:</label>
          <select id="swal-category" class="swal2-select border-1 flex-1 min-w-0">
            ${categories
              .map(
                (cat) =>
                  `<option value="${cat}" ${
                    cat === tx.category ? "selected" : ""
                  }>${cat}</option>`
              )
              .join("")}
          </select>
        </div>

        <div class="flex items-center gap-3">
          <label for="swal-description" class="font-semibold w-28 text-right shrink-0">Description:</label>
          <input type="text" id="swal-description" class="swal2-input flex-1 min-w-0" value="${
            tx.description
          }">
        </div>

        <div class="flex items-center gap-3">
          <label for="swal-amount" class="font-semibold w-28 text-right shrink-0">Amount:</label>
          <input type="number" id="swal-amount" class="swal2-input flex-1 min-w-0" value="${
            tx.amount
          }">
        </div>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const date = document.getElementById("swal-date").value;
        const category = document.getElementById("swal-category").value;
        const description = document.getElementById("swal-description").value;
        const amount = document.getElementById("swal-amount").value;

        if (!date || !category || !description || !amount) {
          Swal.showValidationMessage("All fields are required");
          return false;
        }
        return { date, category, description, amount };
      },
    });

    if (formValues) {
      try {
        const res = await axios.patch(
          `https://vannessplus-demo.onrender.com/api/expenses/update/${id}`,
          formValues
        );
        setTransactions(
          transactions.map((t) =>
            t._id === id
              ? { ...res.data, date: dayjs(res.data.date).format("YYYY-MM-DD") }
              : t
          )
        );
        Swal.fire("Updated!", "Your expense has been updated.", "success");
      } catch (err) {
        console.error("Error updating expense:", err);
        Swal.fire("Error!", "Failed to update expense.", "error");
      }
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    return (
      (!search || tx.description?.includes(search)) &&
      (!filterCategory || tx.category === filterCategory)
    );
  });

  return (
    <div>
      <section className="flex justify-center items-start mt-10 bg-gray-50 py-10">
        <div className="w-full max-w-5xl px-4">
          <h1 className="text-3xl font-semibold mb-6 text-center">
            ExpenseList
          </h1>

          {/* Search & Filter */}
          <div className="flex flex-col lg:flex-row justify-between mb-4 gap-2">
            <input
              type="text"
              placeholder="Search by description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 w-full lg:w-1/2"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 w-full lg:w-1/4"
            >
              <option value="">-- All categories --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="text-center text-lg">No expenses found</p>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border-collapse border text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-2">Date</th>
                      <th className="border px-2 py-2">Category</th>
                      <th className="border px-2 py-2">Description</th>
                      <th className="border px-2 py-2">Amount</th>
                      <th className="border px-2 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-gray-50">
                        <td className="border px-2 py-2">
                          {dayjs(tx.date).format("YYYY-MM-DD")}
                        </td>
                        <td className="border px-2 py-2">{tx.category}</td>
                        <td className="border px-2 py-2">{tx.description}</td>
                        <td className="border px-2 py-2">
                          {tx.amount.toLocaleString()} บาท
                        </td>
                        <td className="border px-2 py-2">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(tx._id)}
                              className="bg-yellow-500 text-white px-2 py-1 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(tx._id)}
                              className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="md:hidden space-y-4">
                {filteredTransactions.map((tx) => (
                  <div key={tx._id} className="bg-white shadow rounded-lg p-4">
                    <p>
                      <span className="font-semibold"> Date:</span>{" "}
                      {dayjs(tx.date).format("YYYY-MM-DD")}
                    </p>
                    <p>
                      <span className="font-semibold"> Category:</span>{" "}
                      {tx.category}
                    </p>
                    <p>
                      <span className="font-semibold"> Description:</span>{" "}
                      {tx.description}
                    </p>
                    <p>
                      <span className="font-semibold"> Amount:</span>{" "}
                      {tx.amount.toLocaleString()} บาท
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(tx._id)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded w-full"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded w-full"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <p className="mt-2 text-lg">
            Showing {filteredTransactions.length} of {transactions.length}{" "}
            expenses
          </p>
        </div>
      </section>
    </div>
  );
}

export default ExpenseList;
