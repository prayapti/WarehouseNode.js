import { useState } from "react";
import "../../cssfiles/inbound1.css";

export function Orderplacement() {
  const [companyName, setCompanyName] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [attachPDF, setAttachPDF] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Agar PDF upload hai, to FormData use karo
      let response;
      if (attachPDF && pdfFile) {
        const formData = new FormData();
        formData.append("companyName", companyName);
        formData.append("productQuantity", productQuantity);
        formData.append("pdfFile", pdfFile);

        response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/sendOrder`, {
          method: "POST",
          body: formData,
        });
      } else {
        // Agar PDF nahi hai, JSON send karo
        response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/sendOrder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName,
            productQuantity,
          }),
        });
      }

      const data = await response.json();
      if (response.ok && data.success) {
        alert("Order placed successfully!");
        // Reset form
        setCompanyName("");
        setProductQuantity("");
        setAttachPDF(false);
        setPdfFile(null);
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="orderPlacement">
      <form id="orderPlacementform" onSubmit={handleSubmit}>
        <h1>Order Placement</h1>
        <div className="innerOrder">
          <div className="rowsOrder">
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="rowsOrder">
            <label htmlFor="productQuantity">Product Quantity</label>
            <input
              type="number"
              id="productQuantity"
              value={productQuantity}
              onChange={(e) => setProductQuantity(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="rowsOrder">
            <label>Want to attach PDF?</label>
            <input
              type="radio"
              name="attachPDF"
              value="yes"
              onChange={() => setAttachPDF(true)}
            />{" "}
            Yes
            <input
              type="radio"
              name="attachPDF"
              value="no"
              onChange={() => setAttachPDF(false)}
              defaultChecked
            />{" "}
            No
          </div>

          {attachPDF && (
            <div className="rowsOrder">
              <label htmlFor="pdfFile">Upload PDF</label>
              <input
                type="file"
                id="pdfFile"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
              />
            </div>
          )}
        </div>

        <button type="submit" className="submitbtn" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}
