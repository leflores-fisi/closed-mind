import { useRef, useState, createContext } from 'react';

export const chatConfigContext = createContext();

export function ChatConfigContextProvider({ children }) {

  const [userCodeVisible, setUserCodeVisible] = useState(false);
  const [serverLogVisible, setServerLogVisible] = useState(true);
  const messagesCountOnTabHidden = useRef(0);

  return (
    <chatConfigContext.Provider value={{
      userCodeVisible, setUserCodeVisible,
      serverLogVisible, setServerLogVisible,
      messagesCountOnTabHidden
    }}>
      { children }
    </chatConfigContext.Provider>
  )
}