import React, { useState ,useEffect ,useRef} from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Camera, CameraOff, CheckCircle, RemoveFormatting } from "lucide-react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import "../../cssfiles/QRGenerator.css";

interface BarcodeScannerProps {
  onBack: () => void;
}
interface Product {
  _id: string;
  name: string;
  [key: string]: any;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState("");
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [ScannerQR,setScannerQR] = useState(false)
  const [productDetails, setProductDetails] = useState<any>(null);
  const token = localStorage.getItem("token");

  const BASE_URL = "https://warehousenode-js-4.onrender.com"; // <-- updated backend URL

  const handleScan = (result: any | null) => {
    if (result && result.length > 0) {
      const code = result[0].rawValue;
      console.log("Scanned product ID:", code);

      setScannedResult(code);
      setIsScanning(false);

      fetchDetailsOfData(code);

      const action = isAdding ? "increment" : "decrement";
      updateInventory(code, action);
    }
  };

  const updateInventory = async (id: string, action: "increment" | "decrement") => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/inventory/products/updates/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      const contentType = response.headers.get("content-type");
      let result: any;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        console.warn("Unexpected response type:", contentType);
        return false;
      }

      if (response.ok) {
        console.log("✅ Product updated:", result);
        setProductDetails(result.data);
        setProducts((prev) =>
          prev.map((p) => (p._id === result._id ? result : p))
        );
        return true;
      } else {
        console.error("❌ Update failed:", result);
        return false;
      }
    } catch (error) {
      console.error("Update failed:", error);
      return false;
    }
  };

  const fetchDetailsOfData = async (id: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/inventory/products/getdetails/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        setProductDetails(result.data);
      } else {
        setProductDetails(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleError = (err: any) => {
    console.error("Scanner error:", err);
    setError(
      "Failed to access camera. Please ensure camera permissions are granted."
    );
    setIsScanning(false);
  };

  const startScanning = () => {
    setError("");
    setScannedResult("");
    setIsScanning(true);
  };

  const AddProduct = () => {
    setIsAdding(true);
    setIsScanning(true);
    setError("");
    setScannedResult("");
  };

  const deleteProduct = () =>{ setIsAdding(false) ; setIsScanning(true);}

  const stopScanning = () => setIsScanning(false);

  const clearResult = () => {
    setScannedResult("");
    setError("");
  };

  // QR Generator
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedQR, setSelectedQR] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const qrRef = useRef<HTMLDivElement | null>(null);

  const handleGenerateQR = (prod: Product) => {
    setSelectedQR(`${prod._id}`);
  };

  const handleDownload = async () => {
    if (!qrRef.current || !selectedQR) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(qrRef.current, { scale: 2 });
      const link = document.createElement("a");
      link.download = `qr-code-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Error downloading QR code:", error);
      alert("Failed to download QR code. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        console.log("Fetching products...");
        const response = await fetch(
          `${BASE_URL}/api/inventory/products/getdetails`,{
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const resData = await response.json();
        console.log("Data received:", resData);

        setProducts(resData);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    getProductDetails();
  }, []);

  return (
    <div className="selectOperation">
      {/* ...rest of your component code unchanged... */}
    </div>
  );
};

export default BarcodeScanner;