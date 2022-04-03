import { useRef, useEffect } from 'react';
import { userSocket } from '@/services/userSocket';
import { useForceUpdate } from '@/hooks/useForceUpdate';
import ChatOptions from './ChatOptions';

function ChatRoomHeader({ roomCode, usersQuantity }) {

  const usersTypingList = useRef([]);
  const updateComponent = useForceUpdate();

  const handleNewUserTyping = (user_id) => {
    console.log('new user is typing', user_id);

    if (!usersTypingList.current.includes(user_id)) {
      usersTypingList.current.push(user_id);
      updateComponent();
      console.log('pushing that user to the list', usersTypingList.current);

      setTimeout(() => {
        usersTypingList.current.splice(usersTypingList.current.indexOf(user_id), 1);
        console.log('removed user after the timeout', usersTypingList.current);
        updateComponent();
      }, 2000);
    }
  };

  useEffect(() => {
    userSocket.on('user-typing', handleNewUserTyping);
    return () => {
      userSocket.removeListener('user-typing', handleNewUserTyping);
    }
  }, [usersTypingList.length])

  return (
    <div className='chat-room-header'>
      <div className='room-header-information'>
        <div className='room-name'>
          {roomCode.substring(0, roomCode.length - 5)}
        </div>
        {
          usersTypingList.current.length > 0
            ? <div className='users-typing'>
                {`${(new Intl.ListFormat('en', { style : 'long', type: 'conjunction'}).format(Array.from(usersTypingList.current)))} typing...`}
              </div>
            : <div className='users-online'>
                {usersQuantity > 1
                  ? `👥 ${usersQuantity} users online`
                  : `👤 ${usersQuantity} user online`}
              </div>
        }
      </div>
      <ChatOptions/>
    </div>
  );
}
export default ChatRoomHeader;