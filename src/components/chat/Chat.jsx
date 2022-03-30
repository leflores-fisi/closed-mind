import { ChatConfigContextProvider } from '@/context/chatConfigContext';
import ChatTerminal from './chat-terminal';
import ResizeColumn from './ResizeColumn';
import ChatSidebar  from './sidebar';

function Chat({ params }) {

  return (
    <ChatConfigContextProvider>
      <ChatSidebar/>
      <ResizeColumn/>
      <ChatTerminal params={params}/>
    </ChatConfigContextProvider>
  )
}

export default Chat;