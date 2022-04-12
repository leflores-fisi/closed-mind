import { createContext, useReducer } from 'react'
import { reducer } from './reducer';

export const chatSessionContext = createContext();

export function ChatSessionContextProvider ({ children }) {

  const initialAppState = {
    socket_is_connected: false,
    username: '',   // "myUsername"
    user_code: '',  // "#af12"
    user_id: '',    // "myUsername#af12"
    user_color: 'default', // css var name

    room_code: '',  // "10a2",
    room_name: '', // "myEpicRoom"
    host: '',
    created_date: undefined,
    privacy: '', // public or private
    users: [],
    messages: [],
    commands_history: []
  };

  const [store, dispatch] = useReducer(reducer, initialAppState);

  return (
    <chatSessionContext.Provider value={{store, dispatch}}>
      {children}
    </chatSessionContext.Provider>
  )
};