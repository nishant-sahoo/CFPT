import axios from "axios";
import React, { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const client = axios.create({
  baseURL: "http://localhost:4000/",
});
export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (name, email, password, cpassword) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await client.post(
        `auth/register`,
        {
          name: name,
          email: email,
          password: password,
        },
        { withCredentials: true }
      );
      //save user to local storage
      // localStorage.setItem("user", JSON.stringify(response));
      //update authContext
      // dispatch({ type: "LOGIN", payload: response });

      setIsLoading(false);
    } catch (err) {
      // console.log("blaa");
      setError(err.response.data.data);
      setIsLoading(false);
    }
  };
  return { signup, isLoading, error };
};
