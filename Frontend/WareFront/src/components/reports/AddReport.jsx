import React, { useState } from "react";
import "../../cssfiles/AddReport.css";

export default function AnnualReportForm({ onReportAdded }) {
  const [formData, setFormData] = useState({
    year: 2024,
    month: 1,
    revenue: "",
    orders: "",
    itemsShipped: "",
    growthRate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ Use environment variable for backend URL
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/annual-reports`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            year: parseInt(formData.year),
            month: parseInt(formData.month),
            revenue: parseFloat(formData.revenue),
            orders: parseInt(formData.orders),
            itemsShipped: parseInt(formData.itemsShipped),
            growthRate: parseFloat(formData.growthRate),
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to submit report");

      const newReport = await res.json();
      setMessage("Report added successfully");
      setFormData({
        year: 2024,
        month: 1,
        revenue: "",
        orders: "",
        itemsShipped: "",
        growthRate: "",
      });

      if (onReportAdded) onReportAdded(newReport);
    } catch (error) {
      console.error(error);
      setMessage("Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="annual-report-form-container">
      <h2>Add Annual Report</h2>
      {message && <div className="form-message">{message}</div>}

      <form className="annual-report-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="2000"
            max="2100"
            required
          />
        </div>

        <div className="form-row">
          <label>Month</label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Revenue ($)</label>
          <input
            type="number"
            name="revenue"
            value={formData.revenue}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-row">
          <label>Orders</label>
          <input
            type="number"
            name="orders"
            value={formData.orders}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Items Shipped</label>
          <input
            type="number"
            name="itemsShipped"
            value={formData.itemsShipped}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Growth Rate (%)</label>
          <input
            type="number"
            name="growthRate"
            value={formData.growthRate}
            onChange={handleChange}
            step="0.1"
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Add Report"}
        </button>
      </form>
    </div>
  );
}
