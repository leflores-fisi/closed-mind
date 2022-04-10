import { useState, createContext } from 'react';

export const overlayContext = createContext();

export function OverlayContextProvider({ children }) {

  const [onMobileRes, setOnMobileRes] = useState(document.body.clientWidth <= 800);
  const [imageOnDetail, setImageOnDetail] = useState({});

  return (
    <overlayContext.Provider value={{
      onMobileRes, setOnMobileRes,
      imageOnDetail, setImageOnDetail
    }}>
      { children }
    </overlayContext.Provider>
  )
}