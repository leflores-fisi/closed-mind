
import { useState, createContext } from 'react';

export const chatInputContext = createContext();

export function ChatInputContextProvider({ children }) {

  const [messageSelected, setMessageSelected] = useState({
    
  });

  return (
    <chatInputContext.Provider value={{
      messageSelected, setMessageSelected
    }}>
      { children }
    </chatInputContext.Provider>
  )
}