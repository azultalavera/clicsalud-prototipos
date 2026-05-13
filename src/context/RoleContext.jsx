import React, { createContext, useContext, useState } from "react";

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(
    () => localStorage.getItem("clicsalud_role") || "efector"
  );

  const changeRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem("clicsalud_role", newRole);
  };

  return (
    <RoleContext.Provider value={{ role, changeRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
};
