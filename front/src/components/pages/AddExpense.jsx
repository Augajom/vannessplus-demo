import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const categories = ["อาหาร", "เดินทาง", "บิล", "บันเทิง", "อื่น ๆ"];

function AddExpense() {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value < 0) {
      setError("จำนวนเงินต้องไม่ติดลบ");
    } else {
      setError("");
      setAmount(value);
    }
  };

  const handleSubmit = async () => {
    if (!date || !category || !details || !amount) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "Please fill in all fields",
      });
      return;
    }

    try {
      const res = await axios.post("https://vannessplus-demo.onrender.com/api/expenses/add", {
        date,
        category,
        description: details,
        amount: Number(amount),
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Expense has been recorded successfully!",
      });

      // reset form
      setDate("");
      setCategory("");
      setDetails("");
      setAmount("");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div>
      <section className="flex justify-center items-center mt-10 bg-gray-50">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold mb-6 text-center">
            AddExpense
          </h1>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-1">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-1">
              Description *
            </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="กรอกรายละเอียด"
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-1">Amout *</label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="กรอกจำนวนเงิน"
              className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-green-400"
              }`}
            />
            {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!date || !category || !details || !amount || error}
              className="px-6 py-3 rounded-lg bg-green-500 text-white text-lg disabled:opacity-50"
            >
              Add Expense
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AddExpense;
