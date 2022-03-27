import { useEffect, useState } from 'react';
import { userSocket } from '../../../userSocket';
import useAppReducer from '../../../../hooks/useAppReducer';
import UserMessage from './UserMessage';
import EmoteReactionButton from './EmoteReactionButton';
import MessageReactionsList from './MessageReactionsList';
import { scrollChatToBottom } from '../../../../Helpers';

function SelMessageLine({ text, date, id, reactions }) {

  const [sent, setSent] = useState(false);
  const {store} = useAppReducer();

  useEffect(() => {
    scrollChatToBottom();

    if (!sent && store.room_code) {
      userSocket.on('message-sent', () => {
        setSent(true);
        userSocket.removeListener('message-sent')
      })
    }
    else setSent(true);
  }, [])

  return (
    <div className={`user-message self ${sent? 'sent' : ''}`}>
      <div className='message-container'>
        <UserMessage date={date} userId={store.user_id} userColor={store.user_color} text={text}/>
        <EmoteReactionButton message_id={id} messageReactions={reactions}/>
      </div>
      <MessageReactionsList message_id={id} reactions={reactions}/>
    </div>
  )
}

export default SelMessageLine;