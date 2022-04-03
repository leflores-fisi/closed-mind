import { ChatConfigContextProvider } from '@/context/chatConfigContext';
import ChatWindow from './chat-window';
import ResizeColumn from './ResizeColumn';
import ChatSidebar  from './sidebar';

function Chat({ params }) {

  return (
    <ChatConfigContextProvider>
      <ChatSidebar/>
      <ResizeColumn/>
      <ChatWindow params={params}/>
    </ChatConfigContextProvider>
  )
}

export default Chat;
