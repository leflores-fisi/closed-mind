import React from 'react'
import ChatTerminal from './chat-terminal';
import ChatSidebar from './sidebar'

function Chat({ params }) {
  return (
    < >
      <ChatSidebar/>
      <ChatTerminal params={params}/>
    </>
  )
}

export default Chat;