import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Download,
} from "lucide-react";
import "../../cssfiles/InventoryManagement.css";

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: 0,
    minStock: 0,
    maxStock: 0,
    price: 0,
    supplier: "",
    location: "",
    locationRow: "",
    locationShelf: "",
    locationColumn: "",
    description: "",
  });

  const token = localStorage.getItem("token");
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports",
    "Food & Beverage",
    "Automotive",
  ];

  // Updated: Use Vite environment variable
  const API_BASE_URL = import.meta.env.VITE_BASE_URL || "https://warehousenode-js-4.onrender.com";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/products/getdetails`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/inventory/products/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to add product");

      const newProduct = await res.json();
      setProducts((prev) => [...prev, newProduct.product || newProduct]);

      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error("Add product error:", err);
      setError(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/products/update/${productId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to update product");
      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? updatedProduct : p))
      );
      setShowEditModal(false);
      setSelectedProduct(null);
      resetForm();
    } catch (err) {
      console.error("Error updating product:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/products/delete/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/products/${productId}/stock`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) throw new Error("Failed to update stock");
      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? updatedProduct : p))
      );
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      stock: 0,
      minStock: 0,
      maxStock: 0,
      price: 0,
      supplier: "",
      location: "",
      description: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      productId: `P${Date.now()}`,
      status:
        formData.stock > formData.minStock
          ? "in-stock"
          : formData.stock > 0
          ? "low-stock"
          : "out-of-stock",
    };

    if (selectedProduct) {
      updateProduct(selectedProduct._id, productData);
    } else {
      addProduct(productData);
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      stock: product.stock,
      minStock: product.minStock,
      maxStock: product.maxStock,
      price: product.price,
      supplier: product.supplier,
      location: product.location,
      description: product.description || "",
    });
    setShowEditModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "in-stock":
        return <Package className="status-icon in-stock" />;
      case "low-stock":
        return <AlertTriangle className="status-icon low-stock" />;
      case "out-of-stock":
        return <AlertTriangle className="status-icon out-of-stock" />;
      default:
        return <Package className="status-icon" />;
    }
  };

  // Rest of your component JSX remains exactly the same...
  return (
    <div className="inventory-management">
      {/* ... */}
    </div>
  );
};

export default InventoryManagement;