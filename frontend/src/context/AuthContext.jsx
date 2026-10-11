import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("expenseflow_user") || "null"); } catch { return null; }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("expenseflow_token")));
  useEffect(() => {
    if (!localStorage.getItem("expenseflow_token")) { setLoading(false); return; }
    authApi.me().then(({ data }) => { setUser(data.user); localStorage.setItem("expenseflow_user", JSON.stringify(data.user)); })
      .catch(() => { localStorage.removeItem("expenseflow_token"); localStorage.removeItem("expenseflow_user"); setUser(null); })
      .finally(() => setLoading(false));
  }, []);
  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem("expenseflow_token", data.token);
    localStorage.setItem("expenseflow_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };
  const logout = () => { localStorage.removeItem("expenseflow_token"); localStorage.removeItem("expenseflow_user"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
