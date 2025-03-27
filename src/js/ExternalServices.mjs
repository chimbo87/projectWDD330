import { convertToJson } from "./utils.mjs";

export default class ExternalServices {
  // ... existing methods ...

  async checkout(payload) {
    const url = "http://wdd330-backend.onrender.com/checkout";
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    }
  }
}