import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Package,
  Truck,
  Building,
  FileText,
  Download,
} from "lucide-react";
import "../../cssfiles/OrderManagement.css";

const OrderManagement = () => {
  const [orderType, setOrderType] = useState("outbound");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [generatePDF, setGeneratePDF] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  // ✅ Use BASE_URL from environment
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${BASE_URL}/orderManagement/companies`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success) setCompanies(data.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/inventory/products/getdetails`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const productsArray = await res.json();
        setProducts(productsArray);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrderClick = (company) => {
    setSelectedCompany(company);
    setOrderProducts([{ productId: "", quantity: 1, notes: "" }]);
    setShowOrderModal(true);
  };

  const handleUpdateClick = (company) => {
    setSelectedCompany(company);
    setShowUpdateModal(true);
  };

  const handleAddCompanyClick = () => {
    setShowAddCompanyModal(true);
  };

  const addProductRow = () => {
    setOrderProducts([...orderProducts, { productId: "", quantity: 1, notes: "" }]);
  };

  const removeProductRow = (index) => {
    const newProducts = orderProducts.filter((_, i) => i !== index);
    setOrderProducts(newProducts);
  };

  const updateProductRow = (index, field, value) => {
    const newProducts = [...orderProducts];
    newProducts[index][field] = value;
    setOrderProducts(newProducts);
  };

  // Submit order
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      orderType,
      companyId: selectedCompany._id,
      products: orderProducts.map((p) => ({
        productId: p.productId,
        quantity: p.quantity,
        notes: p.notes,
      })),
      generatePDF,
    };

    try {
      const res = await fetch(`${BASE_URL}/orderManagement/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order created successfully!");
        setShowOrderModal(false);
        setOrderProducts([]);
        setGeneratePDF(false);
      } else {
        alert(data.message || "Error creating order");
      }
    } catch (err) {
      console.error("Error submitting order:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Update company
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    try {
      const res = await fetch(`${BASE_URL}/orderManagement/companies/${selectedCompany._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert("Company updated successfully!");
        // Refresh companies list
        const companiesRes = await fetch(`${BASE_URL}/orderManagement/companies`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const companiesData = await companiesRes.json();
        if (companiesData.success) setCompanies(companiesData.data);
        setShowUpdateModal(false);
      } else {
        alert(data.message || "Error updating company");
      }
    } catch (err) {
      console.error("Error updating company:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Add company
  const handleSubmitAddCompany = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    try {
      const res = await fetch(`${BASE_URL}/orderManagement/companies`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert("Company added successfully!");
        setShowAddCompanyModal(false);
        // Refresh companies
        const companiesRes = await fetch(`${BASE_URL}/orderManagement/companies`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const companiesData = await companiesRes.json();
        if (companiesData.success) setCompanies(companiesData.data);
      } else {
        alert(data.message || "Error adding company");
      }
    } catch (err) {
      console.error("Error adding company:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // PDF generator
  const generateOrderPDF = () => {
    const orderData = `
ORDER ${orderType.toUpperCase()} - ${new Date().toLocaleDateString()}

Company: ${selectedCompany.name}
Contact: ${selectedCompany.contact}
Email: ${selectedCompany.email}
Phone: ${selectedCompany.phone}
Address: ${selectedCompany.address}
GSTIN:${selectedCompany.GSTIN}
Document: ${selectedCompany.document}

PRODUCTS:
${orderProducts
  .map((product, index) => {
    const productInfo = products.find((p) => p._id === product.productId);
    return `${index + 1}. ${productInfo?.name || "Unknown Product"} - Quantity: ${product.quantity}${
      product.notes ? ` - Notes: ${product.notes}` : ""
    }`;
  })
  .join("\n")}

Order Type: ${orderType.toUpperCase()}
Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([orderData], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${orderType}-order-${selectedCompany.name.replace(/\s+/g, "-")}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="order-management">
      {/* Your existing JSX remains the same */}
      <h1>Order Management</h1>
    </div>
  );
};

export default OrderManagement;
