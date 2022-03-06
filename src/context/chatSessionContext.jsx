import { createContext, useEffect, useReducer } from 'react'
import { reducer } from './reducer';

export const chatSessionContext = createContext();

export function ChatSessionContextProvider ({ children }) {

  //const [id, setId] = useState('6216710863e5fff221c16a54');

  const initialAppState = {
    socket_is_connected: false,
    username: '',  // "guest"
    user_code: '', // "#af12"
    user_id: '', // "guest#af12"
    user_color: '', // css var name
    room_id: '',
    host: '',
    created_date: undefined,
    is_open: undefined,
    users: [],
    messages: [],
    commands_history: []
  };


  useEffect(() => {
    //console.log("Changing state:", store)
  })

  const [store, dispatch] = useReducer(reducer, initialAppState);

  return (
    <chatSessionContext.Provider value={{store, dispatch}}>
      {children}
    </chatSessionContext.Provider>
  )
};