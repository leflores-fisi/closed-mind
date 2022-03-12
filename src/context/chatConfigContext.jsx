import { useState, createContext } from 'react';

export const chatConfigContext = createContext();

export function ChatConfigContextProvider({ children }) {

  const [userCodeVisible, setUserCodeVisible] = useState(false);
  const [serverLogVisible, setServerLogVisible] = useState(true);

  return (
    <chatConfigContext.Provider value={{
      userCodeVisible, setUserCodeVisible, serverLogVisible, setServerLogVisible
    }}>
      { children }
    </chatConfigContext.Provider>
  )
}