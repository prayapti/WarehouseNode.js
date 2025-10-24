import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../cssfiles/header.css";

export function Header1() {
  const navigate = useNavigate();

  const logout = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    navigate("/Login");
  };

  const locateOrder = () => navigate("/order-management");
  const locateBill = () => navigate("/Bills");
  const locateWarehouse = () => navigate("/setWarehouse");
  const locateAnnual = () => navigate("/AnnualReports");
  const locateInventory = () => navigate("/inventory-management");
  const locateToDashboard = () => navigate("/dashboard");
  const locateLayout = () => navigate("/layout");

  return (
    <nav>
      <div
        id="header-nav"
        style={{ position: "fixed", width: "100%", zIndex: 1, top: 0, left: 0 }}
      >
        <div className="dashboard-header-bar">
          <div className="header-left">
            <span className="logo">TG</span>
            <span className="company-name">
              <span className="highlight">TOTAL</span> GROUP
            </span>
          </div>
          <div className="header-right">
            <span className="admin-name">Administrator</span>
            <button className="logout-button" onClick={logout}>
              <i className="fa fa-sign-out"></i> Logout
            </button>
          </div>
        </div>

        <div className="navbar-row">
          <span className="dashboard-overview-title">Dashboard Overview</span>
          <div className="navbar">
            <div className="dropdown">
              <button className="dropbtn" onClick={locateOrder} onDoubleClick={locateToDashboard}>
                Orders
              </button>
            </div>

            <div className="dropdown">
              <button className="dropbtn" onDoubleClick={locateToDashboard}>
                Shipments <i className="fa fa-caret-down"></i>
              </button>
              <div className="dropdown-content">
                <a href="Status.html">Status</a>
                <a href="Delivery.html">Delivery</a>
              </div>
            </div>

            <div className="dropdown">
              <button className="dropbtn" onClick={locateInventory} onDoubleClick={locateToDashboard}>
                Inventory
              </button>
            </div>

            <div className="dropdown">
              <button className="dropbtn">
                Warehouse <i className="fa fa-caret-down"></i>
              </button>
              <div className="dropdown-content">
                <a href="#" onClick={locateLayout}>Layout</a>
                <a href="#" onClick={locateWarehouse}>Warehouse Details</a>
              </div>
            </div>

            <div className="dropdown">
              <button className="dropbtn">
                Reports <i className="fa fa-caret-down"></i>
              </button>
              <div className="dropdown-content">
                <a href="#" onClick={locateAnnual}>Annual</a>
                <a href="#" onClick={locateBill}>Bills</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
