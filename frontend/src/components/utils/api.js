// utils/api.js
export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("access_token"); // ou sessionStorage selon ton cas

  // ✅ si pas de token → redirection directe
  if (!token) {
    window.location.href = "/login";
    return;
  }

  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // ✅ Token expiré ou invalide
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      return;
    }

    return response.json();
  } catch (error) {
    console.error("Erreur réseau/API:", error);
    throw error;
  }
}
