import axios from "axios";
import React, { useState } from "react";
import { useAuthContext } from "./useAuthContext";
const client = axios.create({
  baseURL: "http://localhost:4000/",
});
export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const logout = async () => {
    // remove user form localStorage
    localStorage.removeItem("user");
    // update Authcontext
    dispatch({ type: "LOGOUT" });
    const response = await client.post("auth/logout");
    console.log(response);
  };

  return { logout };
};
