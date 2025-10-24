import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

// Updated: Use Vite environment variable for base URL
const API_BASE_URL = import.meta.env.VITE_BASE_URL || "https://warehousenode-js-4.onrender.com";

// common API request helper function
export async function apiRequest(url, options = {}) {
  // Check if the URL is already absolute
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  
  const response = await fetch(fullUrl, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}