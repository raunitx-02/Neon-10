// Background service worker for RetailStacker Chrome Extension
// Handles cross-origin requests, auth syncing, and state management

const DEV_API_URL = "http://localhost:3000";
const PROD_API_URL = "https://retailstacker.com";

// Dynamically check which API backend is available
async function getApiUrl() {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(`${DEV_API_URL}/api/extension/auth/me`, { 
      method: "HEAD",
      signal: controller.signal
    });
    clearTimeout(id);
    if (res.ok || res.status === 401) {
      return DEV_API_URL;
    }
  } catch (e) {
    // If local dev server is offline, fallback to production
  }
  return PROD_API_URL;
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "check-session") {
    handleCheckSession().then(sendResponse);
    return true; // Keep message channel open for async response
  }

  if (request.action === "login") {
    handleLogin(request.email, request.password).then(sendResponse);
    return true;
  }

  if (request.action === "register") {
    handleRegister(request.data).then(sendResponse);
    return true;
  }

  if (request.action === "fetch-xray") {
    handleFetchXray(request.asins).then(sendResponse);
    return true;
  }

  if (request.action === "fetch-storefront") {
    handleFetchStorefront(request.sellerId).then(sendResponse);
    return true;
  }

  if (request.action === "fetch-suggestions") {
    handleFetchSuggestions(request.query).then(sendResponse);
    return true;
  }
});

// Sync cookies session from the website
async function handleCheckSession() {
  try {
    const API_BASE = await getApiUrl();
    const res = await fetch(`${API_BASE}/api/extension/auth/me`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      credentials: "include"
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Background check-session failed:", err);
    return { loggedIn: false, error: "Unable to connect to server" };
  }
}

// Handle email-password login
async function handleLogin(email, password) {
  try {
    const API_BASE = await getApiUrl();
    const res = await fetch(`${API_BASE}/api/extension/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Background login failed:", err);
    return { success: false, error: "Network error. Please try again." };
  }
}

// Handle signup registration
async function handleRegister(payload) {
  try {
    const API_BASE = await getApiUrl();
    const res = await fetch(`${API_BASE}/api/extension/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include"
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Background register failed:", err);
    return { success: false, error: "Network error. Please try again." };
  }
}

// Fetch Keepa product analytics
async function handleFetchXray(asins) {
  try {
    const API_BASE = await getApiUrl();
    const res = await fetch(`${API_BASE}/api/extension/xray`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ asins }),
      credentials: "include"
    });
    
    if (res.status === 401) {
      return { listings: [], gated: true, unauthorized: true };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Background fetch-xray failed:", err);
    return { listings: [], error: "Network error or Server Timeout" };
  }
}

// Fetch Amazon storefront catalog & metadata
async function handleFetchStorefront(sellerId) {
  try {
    const API_BASE = await getApiUrl();
    const res = await fetch(`${API_BASE}/api/amazon/scanner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "initialize", input: sellerId }),
      credentials: "include"
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Background fetch-storefront failed:", err);
    return { error: "Network error or Server Timeout" };
  }
}
// Fetch Amazon search query completion suggestions via our own API server proxy (bypasses CORS/CSP and Origin blocks)
async function handleFetchSuggestions(query) {
  try {
    const API_BASE = await getApiUrl();
    const res = await fetch(`${API_BASE}/api/extension/suggestions?q=${encodeURIComponent(query)}`, {
      credentials: "include"
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Background fetch-suggestions failed:", err);
    return { suggestions: [] };
  }
}
