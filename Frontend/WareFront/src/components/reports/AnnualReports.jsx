import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import RevenueChart from "./revenueChart";
import OrdersChart from "./OrdersChart";
import "../../cssfiles/AnnualReports.css";

export default function AnnualReports() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["/api/annual-reports"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/annual-reports`);
      if (!response.ok) throw new Error("Failed to fetch annual reports");
      return response.json();
    },
  });

  const summaryStats = reports
    ? {
        totalRevenue: reports.reduce(
          (sum, report) => sum + parseFloat(report.revenue),
          0
        ),
        totalOrders: reports.reduce((sum, report) => sum + report.orders, 0),
        totalShipped: reports.reduce(
          (sum, report) => sum + report.itemsShipped,
          0
        ),
        avgGrowthRate:
          reports.reduce(
            (sum, report) => sum + parseFloat(report.growthRate),
            0
          ) / reports.length,
      }
    : null;

  const exportTableToCSV = () => {
    if (!reports) return;

    const headers = ["Month", "Revenue", "Orders", "Items Shipped", "Growth"];
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const rows = reports.map(report => [
      monthNames[report.month - 1],
      report.revenue,
      report.orders,
      report.itemsShipped,
      report.growthRate + "%"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "annual_reports.csv";
    link.click();
  };

  return (
    <div className="annual-reports-container" data-testid="annual-reports-view">
      <div className="report-card">
        <div className="report-header">
          <h2>Annual Reports 2024</h2>
          <div className="header-actions">
            <select defaultValue="2024" data-testid="year-select">
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <button data-testid="export-button" onClick={exportTableToCSV}>⬇ Export</button>
          </div>
        </div>

        {isLoading ? (
          <div className="stats-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="stat-box loading">
                <div className="placeholder small"></div>
                <div className="placeholder big"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="stats-grid">
            <div className="stat-box" data-testid="total-revenue-stat">
              <p>Total Revenue</p>
              <h3>${summaryStats?.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="stat-box" data-testid="total-orders-stat">
              <p>Orders Processed</p>
              <h3>{summaryStats?.totalOrders.toLocaleString()}</h3>
            </div>
            <div className="stat-box" data-testid="total-shipped-stat">
              <p>Items Shipped</p>
              <h3>{summaryStats?.totalShipped.toLocaleString()}</h3>
            </div>
            <div className="stat-box" data-testid="growth-rate-stat">
              <p>Growth Rate</p>
              <h3 className="growth">+{summaryStats?.avgGrowthRate.toFixed(1)}%</h3>
            </div>
          </div>
        )}
      </div>

      <div className="charts-grid">
        <RevenueChart reports={reports} isLoading={isLoading} />
        <OrdersChart reports={reports} isLoading={isLoading} />
      </div>

      <div className="report-card">
        <h3>Detailed Annual Metrics</h3>
        <div className="table-wrapper">
          <table className="metrics-table" data-testid="metrics-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Orders</th>
                <th>Items Shipped</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="5" className="placeholder-row">Loading...</td>
                  </tr>
                ))
              ) : (
                reports?.map((report) => {
                  const monthNames = [
                    "January","February","March","April","May","June",
                    "July","August","September","October","November","December",
                  ];
                  return (
                    <tr key={`${report.year}-${report.month}`} data-testid={`metrics-row-${report.month}`}>
                      <td>{monthNames[report.month - 1]}</td>
                      <td>${parseFloat(report.revenue).toLocaleString()}</td>
                      <td>{report.orders.toLocaleString()}</td>
                      <td>{report.itemsShipped.toLocaleString()}</td>
                      <td className="growth">+{report.growthRate}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}