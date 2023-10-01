import axios from "axios";
import React, { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const client = axios.create({
  baseURL: "http://localhost:4000/",
  withCredentials: true,
});
export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await client.post(`auth/login`, {
        email: email,
        password: password,
      });
      //save user to local storage
      console.log(response);
      localStorage.setItem("user", JSON.stringify(response));
      //update authContext
      dispatch({ type: "LOGIN", payload: response });

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.response.data.data);
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};
