import React, { useEffect, useState } from "react";

const LocationMap = () => {
  const [locations, setLocations] = useState([]);
  const token = localStorage.getItem("token");
  
  // Updated: Use Vite environment variable
  const API_BASE_URL = import.meta.env.VITE_BASE_URL || "https://warehousenode-js-4.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/inventory/products/getdetails`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log(data);
        setLocations(data.products || data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Extract occupied locations (like ["F-5-19", "C-6-10", ...])
  const occupied = locations.map((item) => item.location.trim().toUpperCase());

  // Helper to check if a cell is occupied
  const isOccupied = (row, col, shelf) => {
    const loc = `${row}-${col}-${shelf}`;
    return occupied.includes(loc);
  };

  // Generate all rows, columns, and shelves
  const rows = "ABCDE".split(""); // 15 rows: A → O
  const cols = Array.from({ length: 10 }, (_, i) => i + 1);
  const shelves = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Warehouse Layout</h1>
      <div style={styles.grid}>
        {rows.map((row) =>
          cols.map((col) =>
            shelves.map((shelf) => {
              const occupiedCell = isOccupied(row, col, shelf);
              return (
                <div
                  key={`${row}-${col}-${shelf}`}
                  style={{
                    ...styles.cell,
                    backgroundColor: occupiedCell ? "#e63946" : "#2a9d8f",
                  }}
                >
                  {row}-{col}-{shelf}
                </div>
              );
            })
          )
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  heading: {
    color: "#333",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(15, 1fr)",
    gap: "6px",
    justifyItems: "center",
  },
  cell: {
    width: "70px",
    height: "40px",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    transition: "all 0.2s ease-in-out",
  },
};

export default LocationMap;