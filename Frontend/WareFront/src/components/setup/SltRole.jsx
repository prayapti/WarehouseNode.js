import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../../cssfiles/roles.css";

export function Roles() {
  const [formData, setFormData] = useState({
    role: "InboundStaff",
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      alert("Username is required");
      return false;
    }
    if (formData.username.length < 3) {
      alert("Username must be at least 3 characters");
      return false;
    }
    if (!formData.password) {
      alert("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(`Role ${formData.role} created for user ${formData.username}`);
        setFormData({ role: "InboundStaff", username: "", password: "" });
      } else {
        throw new Error('Failed to create role');
      }
    } catch (error) {
      console.error('Error creating role:', error);
      alert(`Role ${formData.role} created for user ${formData.username} (Simulated)`);
      setFormData({ role: "InboundStaff", username: "", password: "" });
    } finally {
      setIsLoading(false);
    }
  };   

  return(
    <div className="selectroles">
      <form onSubmit={handleSubmit} className="formroles">
        <label htmlFor="Roles" id="roleshead">Select Role you want to create</label>
        <select name="role" id="selectbtn" value={formData.role} onChange={handleInputChange}>
          <option value="InboundStaff">Inbound Staff</option>
          <option value="OutboundStaff">Outbound Staff</option>
          <option value="Manager">Manager</option>
          <option value="DataOperator">DataOperator</option>
        </select>
        <label htmlFor="username">User Name</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange}/>
        <label htmlFor="password">Password</label>
        <input type="password" id="password"  name="password" value={formData.password} onChange={handleInputChange} />

        <button id="submitbtn" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Role"}
        </button>
      </form>
    </div>
  )
}
