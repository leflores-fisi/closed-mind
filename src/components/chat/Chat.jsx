import { ChatConfigContextProvider } from './../../context/chatConfigContext';
import ChatTerminal from './chat-terminal';
import ChatSidebar from './sidebar';

function Chat({ params }) {
  return (
    <ChatConfigContextProvider>
      <ChatSidebar/>
      <ChatTerminal params={params}/>
    </ChatConfigContextProvider>
  )
}

export default Chat;