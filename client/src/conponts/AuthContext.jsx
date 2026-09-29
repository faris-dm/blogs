import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    fetch("http://localhost:2019/api/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => setUser(json.user))
      .catch(() => setUser(null))
      .finally(() => setCheckingAuth(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
