import { createContext, useReducer } from 'react'
import { reducer } from './reducer';

export const chatSessionContext = createContext();

export function ChatSessionContextProvider ({ children }) {

  //const [id, setId] = useState('6216710863e5fff221c16a54');

  const initialAppState = {
    socket_is_connected: false,
    username: '',   // "myUsername"
    user_code: '',  // "#af12"
    user_id: '',    // "myUsername#af12"
    user_color: 'default', // css var name
    room_code: '',  // "room#10a2"
    host: '',
    created_date: undefined,
    invitations_only: undefined,
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