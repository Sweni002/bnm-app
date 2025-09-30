export async function authFetch(url, options = {}, navigate) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    navigate("/login");
    return null;
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    // si ce n'est pas FormData, on met Content-Type
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("access_token");
      navigate("/login");
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error("Erreur authFetch :", err);
    return null;
  }
}


// utils/authFetch.js
export async function authFetchPdf(url, options = {}, navigate, responseType = "json") {
  const token = localStorage.getItem("access_token");

  if (!token) {
    navigate("/login");
    return null;
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("access_token");
      navigate("/login");
      return null;
    }

    // ✅ Gérer plusieurs types de réponse
    if (responseType === "blob") {
      return await response.blob();
    } else if (responseType === "text") {
      return await response.text();
    } else {
      return await response.json();
    }
  } catch (err) {
    console.error("Erreur authFetch :", err);
    return null;
  }
}
