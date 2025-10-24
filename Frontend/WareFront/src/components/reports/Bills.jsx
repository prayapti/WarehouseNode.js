import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import BillsTable from "./billsTable"; 
import "../../cssfiles/Bills.css"; 

export default function Bills() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("this_month");
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Fetch bills from backend using VITE_BASE_URL
  const { data: bills, isLoading } = useQuery({
    queryKey: ["/api/bills"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/bills`);
      if (!res.ok) throw new Error("Failed to fetch bills");
      return res.json();
    },
  });

  // Mutation for updating bill status
  const updateBillStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/bills/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      if (!res.ok) throw new Error("Failed to update bill status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
    },
  });

  const filteredBills = bills?.filter((bill) => {
    const matchesStatus =
      statusFilter === "all" || bill.status === statusFilter;
    const matchesSearch =
      searchTerm === "" ||
      bill.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.billId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const billsSummary = bills
    ? {
        total: bills.length,
        paid: bills.filter((b) => b.status === "paid").length,
        pending: bills.filter((b) => b.status === "pending").length,
        overdue: bills.filter((b) => b.status === "overdue").length,
      }
    : null;

  const handleStatusUpdate = (billId, newStatus) => {
    updateBillStatusMutation.mutate({ id: billId, status: newStatus });
  };

  return (
    <div className="bills-container" data-testid="bills-view">
      <div className="card">
        <div className="card-content">
          <div className="header-row">
            <h2>Bills Management</h2>
            <div className="header-actions">
              <input
                type="text"
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                data-testid="search-bills-input"
              />
              <button className="new-bill-btn" data-testid="new-bill-button">
                ＋ New Bill
              </button>
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
              <div className="stat-box" data-testid="total-bills-stat">
                <p>Total Bills</p>
                <h3>{billsSummary?.total}</h3>
              </div>
              <div className="stat-box" data-testid="paid-bills-stat">
                <p>Paid</p>
                <h3 className="green">{billsSummary?.paid}</h3>
              </div>
              <div className="stat-box" data-testid="pending-bills-stat">
                <p>Pending</p>
                <h3 className="orange">{billsSummary?.pending}</h3>
              </div>
              <div className="stat-box" data-testid="overdue-bills-stat">
                <p>Overdue</p>
                <h3 className="red">{billsSummary?.overdue}</h3>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Bills</h3>
          <div className="filters">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              data-testid="status-filter"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              data-testid="period-filter"
            >
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_year">This Year</option>
            </select>
          </div>
        </div>
        <div className="card-content">
          <BillsTable
            bills={filteredBills}
            isLoading={isLoading}
            onStatusUpdate={handleStatusUpdate}
            isUpdating={updateBillStatusMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
