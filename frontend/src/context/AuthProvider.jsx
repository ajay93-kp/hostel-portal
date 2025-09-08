// import { useState } from "react";
// import { AuthContext } from "./AuthContext.jsx";

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);

//   // Accept an object to avoid argument order confusion
//   const login = ({ userData, tokenData }) => {
//     setUser(userData);
//     setToken(tokenData || null);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

import { useState } from "react";
import { AuthContext } from "./AuthContext.jsx";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const json = localStorage.getItem("user");
    return json ? JSON.parse(json) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  const login = ({ userData, tokenData }) => {
    setUser(userData);
    setToken(tokenData || null);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData || "");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
