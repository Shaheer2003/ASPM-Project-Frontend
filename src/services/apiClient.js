const DEFAULT_BASE_URL = "http://localhost:8000";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token || null;
};

const buildHeaders = (extraHeaders) => {
  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return headers;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : null;
};

const normalizeError = (status, payload) => {
  const message = payload?.detail || payload?.message || `Request failed (${status}).`;
  return { ok: false, status, message, data: payload };
};

export const apiRequest = async (path, options = {}) => {
  const { method = "GET", body, headers } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders(headers),
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw normalizeError(response.status, payload);
  }

  return payload;
};

export const getApiBaseUrl = () => API_BASE_URL;
