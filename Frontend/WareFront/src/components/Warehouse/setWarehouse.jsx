import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../cssfiles/warehouse.css";

export function WarehouseDetails() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    WarehouseCompany_Name: "",
    WarehouseCompany_Address: "",
    WarehouseCompany_City: "",
    WarehouseCompany_GSTIN: "",
    WarehouseCompany_State: "",
    WarehouseCompany_Pincode: "",
    WarehouseCompany_Contact: "",
    WarehouseCompany_Email: "",
    WarehouseCompany_Type: "Shipping",
  });

  const token = localStorage.getItem("token")
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Updated: Use Vite environment variable
  const API_BASE_URL = import.meta.env.VITE_BASE_URL || "https://warehousenode-js-4.onrender.com";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // console.log(token)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      console.log(token)
      const response = await fetch(`${API_BASE_URL}/warehouse/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData), 
      });

      const result = await response.json();

      if (response.ok) {
        alert("Warehouse registered successfully!");
        navigate("/dashboard");
      } else {
        alert(`Registration failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Error: ${error.message || "Network error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="warehouse-container">
      <div className="warehouse-form-wrapper">
        <h1 className="warehouse-title">Warehouse Registration</h1>

        <form
          className="warehouse-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="WarehouseCompany_Name" className="form-label">
              Company Name *
            </label>
            <input
              type="text"
              id="WarehouseCompany_Name"
              name="WarehouseCompany_Name"
              className="form-input"
              value={formData.WarehouseCompany_Name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="WarehouseCompany_Address" className="form-label">
              Address *
            </label>
            <input
              type="text"
              id="WarehouseCompany_Address"
              name="WarehouseCompany_Address"
              className="form-input"
              value={formData.WarehouseCompany_Address}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="WarehouseCompany_City" className="form-label">
                City *
              </label>
              <input
                type="text"
                id="WarehouseCompany_City"
                name="WarehouseCompany_City"
                className="form-input"
                value={formData.WarehouseCompany_City}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="WarehouseCompany_State" className="form-label">
                State *
              </label>
              <input
                type="text"
                id="WarehouseCompany_State"
                name="WarehouseCompany_State"
                className="form-input"
                value={formData.WarehouseCompany_State}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="WarehouseCompany_GSTIN" className="form-label">
                GSTIN *
              </label>
              <input
                type="text"
                id="WarehouseCompany_GSTIN"
                name="WarehouseCompany_GSTIN"
                className="form-input"
                value={formData.WarehouseCompany_GSTIN}
                onChange={handleInputChange}
                title="Please enter a valid GSTIN"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="WarehouseCompany_Pincode" className="form-label">
                Pincode *
              </label>
              <input
                type="text"
                id="WarehouseCompany_Pincode"
                name="WarehouseCompany_Pincode"
                className="form-input"
                value={formData.WarehouseCompany_Pincode}
                onChange={handleInputChange}
                pattern="[0-9]{6}"
                title="Please enter a valid 6-digit pincode"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="WarehouseCompany_Contact" className="form-label">
                Contact Number *
              </label>
              <input
                type="tel"
                id="WarehouseCompany_Contact"
                name="WarehouseCompany_Contact"
                className="form-input"
                value={formData.WarehouseCompany_Contact}
                onChange={handleInputChange}
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="WarehouseCompany_Email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                id="WarehouseCompany_Email"
                name="WarehouseCompany_Email"
                className="form-input"
                value={formData.WarehouseCompany_Email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="WarehouseCompany_Type" className="form-label">
              Warehouse Type *
            </label>
            <select
              id="WarehouseCompany_Type"
              name="WarehouseCompany_Type"
              className="form-select"
              value={formData.WarehouseCompany_Type}
              onChange={handleInputChange}
              required
            >
              <option value="Shipping">Shipping</option>
              <option value="E-commerce">E-commerce</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register Warehouse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}