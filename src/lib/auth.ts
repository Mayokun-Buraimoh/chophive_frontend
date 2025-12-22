import { jwtDecode } from "jwt-decode";

export function getUserIdFromToken(): number | null {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const decoded: any = jwtDecode(token);
  return decoded.user_id || decoded.id || null;
}
