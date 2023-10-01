import React, { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw Error(
      "AuthContextuthContext must be used inside AuthContextProvider"
    );
  }
  return context;
};
