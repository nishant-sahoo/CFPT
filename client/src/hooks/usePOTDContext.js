import { POTDContext } from "../utils/POTDContext"
import { useContext } from "react"

export const usePOTDContext = () => {
  const context = useContext(POTDContext)

  if(!context) {
    throw Error('usePOTDContext must be used inside an POTDContextProvider')
  }

  return context
}