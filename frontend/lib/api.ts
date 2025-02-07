export const API_URL = "http://localhost:3000";

export const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(`${API_URL}${url}`, options);
  if (!res.ok) throw new Error("Erreur API");
  return res.json();
};
