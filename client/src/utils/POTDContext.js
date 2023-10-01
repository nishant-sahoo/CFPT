import { createContext, useReducer } from "react";

import { useAuthContext } from "../hooks/useAuthContext";

export const POTDContext = createContext();

export const potdReducer = (state, action, user) => {
  switch (action.type) {
    case "SET_POTD":
      if (user.role === "Admin") {
        return {
          potd: action.payload,
        };
      } else {
        const filteredPotd = action.payload.filter(
          (item) => new Date(item.publishedAt) <= new Date()
        );
        return {
          potd: filteredPotd,
        };
      }
    case "CREATE_POTD":
      return {
        potd: [action.payload, ...state.potd],
      };
    case "UPDATE_POTD":
      return {
        potd: state.potd.map((item) =>
          item._id === action.payload._id ? action.payload : item
        ),
      };
    case "DELETE_POTD":
      return {
        potd: state.potd.filter((item) => item._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const POTDContextProvider = ({ children }) => {
  const { user } = useAuthContext();

  const [state, dispatch] = useReducer(
    (state, action) => potdReducer(state, action, user),
    {
      potd: null,
    }
  );

  return (
    <POTDContext.Provider value={{ ...state, dispatch }}>
      {children}
    </POTDContext.Provider>
  );
};
