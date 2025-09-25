import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("today");
  const [customRange, setCustomRange] = useState([null, null]);
  const [loading, setLoading] = useState(true);

  const [startDate, endDate] = customRange;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get("https://vannessplus-demo.onrender.com/api/expenses/get");
        setExpenses(res.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const getFilteredExpenses = () => {
  const now = dayjs();

  switch (filter) {
    case "today":
      return expenses.filter(e => dayjs(e.date).isSame(now, "day"));

    case "week":
      return expenses.filter(e => dayjs(e.date).isSame(now, "week"));

    case "month":
      return expenses.filter(e => dayjs(e.date).isSame(now, "month"));

    case "custom":
      if (customRange[0] && customRange[1]) {
        return expenses.filter(e =>
          dayjs(e.date).isAfter(dayjs(customRange[0]).subtract(1, "day")) &&
          dayjs(e.date).isBefore(dayjs(customRange[1]).add(1, "day"))
        );
      }
      return expenses;

    default:
      return expenses;
  }
};

  // คำนวณยอดรวม
  const filteredExpenses = getFilteredExpenses();
  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // คำนวณรายจ่ายตามหมวดหมู่
  const categoryData = Object.values(
    filteredExpenses.reduce((acc, e) => {
      if (!acc[e.category]) acc[e.category] = { name: e.category, value: 0 };
      acc[e.category].value += e.amount;
      return acc;
    }, {})
  );

  // คำนวณรายจ่ายตามวัน (group by date)
  const dailyData = Object.values(
    filteredExpenses.reduce((acc, e) => {
      if (!acc[e.date]) acc[e.date] = { date: e.date, amount: 0 };
      acc[e.date].amount += e.amount;
      return acc;
    }, {})
  );

  return (
    <div>
      <section className="flex flex-col items-center mt-10 bg-gray-50 py-8">
        <div className="w-full max-w-6xl px-4">
          <h1 className="text-3xl font-semibold mb-6 text-center">Dashboard</h1>

          {/* Filter */}
          <div className="flex flex-col lg:flex-row gap-3 justify-center items-center mb-6">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border px-2 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="today">วันนี้</option>
              <option value="week">สัปดาห์นี้</option>
              <option value="month">เดือนนี้</option>
              <option value="custom">กำหนดเอง</option>
            </select>

            {filter === "custom" && (
              <DatePicker
                selectsRange
                startDate={customRange[0]}
                endDate={customRange[1]}
                onChange={(update) => {
                  setCustomRange(update);
                  setFilter("custom");
                }}
                dateFormat="yyyy-MM-dd"
                className="border px-3 py-2 rounded-lg"
                placeholderText="เลือกช่วงวันที่"
                isClearable
              />
            )}
          </div>

          {/* Total */}
          <div className="bg-white rounded-xl shadow p-6 mb-6 text-center">
            <h2 className="text-2xl font-semibold">💰 ยอดรวมทั้งหมด</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {total.toLocaleString()} บาท
            </p>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                รายจ่ายตามหมวดหมู่
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                รายจ่ายตามวัน
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="จำนวนเงิน" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


export default Dashboard