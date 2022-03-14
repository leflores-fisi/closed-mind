import { useState, createContext } from 'react';

export const overlayContext = createContext();

export function OverlayContextProvider({ children }) {

  const [onMobileRes, setOnMobileRes] = useState(document.body.clientWidth <= 800);

  return (
    <overlayContext.Provider value={{
      onMobileRes, setOnMobileRes
    }}>
      { children }
    </overlayContext.Provider>
  )
}