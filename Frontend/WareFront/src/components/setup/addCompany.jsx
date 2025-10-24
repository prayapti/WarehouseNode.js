import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AddCompany = () => {
  const [formData, setFormData] = useState({
    CompanyName: "",
    CompanyAddress: "",
    CompanyPhone: "",
    CompanyEmail: "",
  });

  const [companyDocument, setCompanyDocument] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setCompanyDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("CompanyName", formData.CompanyName);
      data.append("CompanyAddress", formData.CompanyAddress);
      data.append("CompanyPhone", formData.CompanyPhone);
      data.append("CompanyEmail", formData.CompanyEmail);
      data.append("GSTIN", formData.GSTIN);
      data.append("CompanyDocuments", companyDocument);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/CompanyView`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result.message);
        navigate("/Dashboard");
      } else {
        console.log(result.message || "Something went wrong");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <form className="company-form" onSubmit={handleSubmit}>
        <h2>Inbound Company Registration</h2>

        <label>Company Name</label>
        <input
          type="text"
          name="CompanyName"
          value={formData.CompanyName}
          onChange={handleChange}
          required
        />

        <label>Company Address</label>
        <textarea
          name="CompanyAddress"
          value={formData.CompanyAddress}
          onChange={handleChange}
          required
        ></textarea>

        <label>Company Phone</label>
        <input
          type="text"
          name="CompanyPhone"
          value={formData.CompanyPhone}
          pattern="\d{10}"
          title="Please enter a valid 10-digit phone number"
          onChange={handleChange}
          required
        />

        <label>Company Email</label>
        <input
          type="email"
          name="CompanyEmail"
          value={formData.CompanyEmail}
          onChange={handleChange}
          required
        />

        <label>Company Documents</label>
        <input
          type="file"
          name="CompanyDocuments"
          onChange={handleFileChange}
          required
        />

        <label>GSTIN</label>
        <input
          type="text"
          name="GSTIN"
          value={formData.GSTIN}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>

      <style>
        {`
          .company-form {
            max-width: 500px;
            margin: 40px auto;
            padding: 20px;
            margin-top:20vh;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: #f9f9f9;
            font-family: Arial, sans-serif;
          }
          .company-form h2 {
            text-align: center;
            margin-bottom: 20px;
          }
          .company-form label {
            display: block;
            margin-bottom: 6px;
            font-weight: bold;
          }
          .company-form input,
          .company-form textarea {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          .company-form button {
            width: 100%;
            padding: 10px;
            background: orangered;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .company-form button:hover {
            background: #df4019ff;
          }
          @media (max-width: 768px) {
            .company-form{
                margin-top:40vh;
            }
          }
          @media (max-width: 1300px) {
            .company-form{
                margin-top:30vh;
            }
          }
        `}
      </style>
    </>
  );
};
