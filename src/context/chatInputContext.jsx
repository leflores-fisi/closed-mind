
import { useState, createContext } from 'react';

export const chatInputContext = createContext();

export function ChatInputContextProvider({ children }) {

  const [messageReplying, setMessageReplying] = useState(null);

  return (
    <chatInputContext.Provider value={{
      messageReplying, setMessageReplying
    }}>
      { children }
    </chatInputContext.Provider>
  )
}