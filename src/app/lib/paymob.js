// utils/paymob.js
const axios = require("axios");

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_AUTH_URL = process.env.PAYMOB_AUTH_URL;
const PAYMOB_ORDER_URL = process.env.PAYMOB_ORDER_URL;
const PAYMOB_PAYMENT_KEY_URL = process.env.PAYMOB_PAYMENT_KEY_URL;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;

// Step 1: Authenticate and get a token
async function getAuthToken() {
  try {
    const response = await axios.post(PAYMOB_AUTH_URL, {
      api_key: PAYMOB_API_KEY,
    });

    if (!response.data.token) {
      throw new Error("Paymob authentication failed, token not received.");
    }

    console.log("✅ Paymob Auth Token Received:", response.data.token);
    return response.data.token;
  } catch (error) {
    console.error(
      "❌ Paymob Authentication Error:",
      error.response?.data || error.message
    );
    return null;
  }
}

// Step 2: Create an order
async function createOrder(token, amount, userId, courseId) {
  if (!token) {
    console.error("❌ Error: Token is undefined. Cannot create order.");
    return { error: "Authentication token is missing." };
  }

  console.log("📦 Order Payload:", {
    auth_token: token,
    delivery_needed: false,
    amount_cents: amount * 100,
    currency: "EGP",
    items: [],
    merchant_order_id: courseId,
  });

  try {
    const response = await axios.post(PAYMOB_ORDER_URL, {
      auth_token: token,
      delivery_needed: false,
      amount_cents: amount * 100, // Convert to cents
      currency: "EGP",
      items: [],
      merchant_order_id: `${courseId}-${userId}-${Date.now()}`, // Associate the order with the course
    });

    console.log("✅ Order Created Successfully:", response.data);
    return response.data.id; // Return Order ID
  } catch (error) {
    console.error(
      "❌ Paymob Order Creation Failed:",
      error.response?.data || error.message
    );
    return { error: "Failed to create Paymob order." };
  }
}

// Step 3: Generate a payment key
async function getPaymentKey(token, orderId, amount, userData) {
  console.log("amount", userData.amount, "courseId", orderId, "token", token);

  if (!token || !orderId || !userData || !amount) {
    console.error(
      "❌ Error: Missing required parameters (Token, Order ID, or Amount)."
    );
    return { error: "Authentication token, Order ID, or Amount is missing." };
  }

  console.log("📦 userData:", userData);

  try {
    const response = await axios.post(PAYMOB_PAYMENT_KEY_URL, {
      auth_token: token,
      amount_cents: amount * 100, // Ensure amount is provided
      expiration: 3600, // 1 hour
      order_id: orderId,
      billing_data: {
        first_name: userData.firstName || "N/A",
        last_name: userData.lastName || "N/A",
        email: userData.email || "N/A",
        phone_number: userData.phone || "N/A",
        street: userData.street || "Unknown", // REQUIRED
        building: userData.building || "Unknown", // REQUIRED
        floor: userData.floor || "Unknown", // REQUIRED
        apartment: userData.apartment || "Unknown", // REQUIRED
        city: userData.city || "Unknown", // REQUIRED
        country: userData.country || "EG", // REQUIRED (default to Egypt)
      },
      currency: "EGP",
      integration_id: PAYMOB_INTEGRATION_ID, // Your Paymob integration ID
      redirect_url: "https://dr-website-kappa.vercel.app/paymentResult",
    });

    console.log("✅ Payment Key Generated Successfully:", response.data.token);
    return response.data.token; // Payment key
  } catch (error) {
    console.error(
      "❌ Paymob Payment Key Creation Failed:",
      error.response?.data || error.message
    );
    return { error: "Failed to create Paymob payment key." };
  }
}

module.exports = { getAuthToken, createOrder, getPaymentKey };
