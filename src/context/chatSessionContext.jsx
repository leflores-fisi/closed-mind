import { createContext, useEffect, useReducer, useState } from 'react'
import { reducer } from './reducer';

export const chatSessionContext = createContext();

export function ChatSessionContextProvider ({ children }) {

  //const [id, setId] = useState('6216710863e5fff221c16a54');

  const initialAppState = {
    is_connected: false,
    username: '',  // "guest"
    user_code: '', // "guest#af12"
    user_id: '',
    room_id: '',
    host: '',
    created_date: undefined,
    is_open: undefined,
    users: [],
    messages: [],
    commands_history: []
  };

  // useEffect(() => {
  //   const asyncFetch = async () => {
  //     const session = await fetch(`http://localhost:8001/sessions/${id}`)
  //       .then(res => res.json());
  //     setChatSession(session);
  //   }
  //   asyncFetch();
  // }, [id]);
  useEffect(() => {
    console.log("Changing state:", store)
  })

  const [store, dispatch] = useReducer(reducer, initialAppState);

  return (
    <chatSessionContext.Provider value={{store, dispatch}}>
      {children}
    </chatSessionContext.Provider>
  )
};