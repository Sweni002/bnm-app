const BASE_URL = "http://192.168.10.31:8000"; // URL par défaut

export async function authFetch(endpoint, options = {}, navigate) {
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

    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

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

export async function authFetchPdf(endpoint, options = {}, navigate, responseType = "json") {
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

    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("access_token");
      navigate("/login");
      return null;
    }

    if (responseType === "blob") {
      return await response.blob();
    } else if (responseType === "text") {
      return await response.text();
    } else {
      return await response.json();
    }
  } catch (err) {
    console.error("Erreur authFetchPdf :", err);
    return null;
  }
}
