import { useEffect, useState } from 'react';
import { userSocket } from '@//services/userSocket';
import useAppReducer from '@//hooks/useAppReducer';
import UserMessage from './UserMessage';
import EmoteReactionButton from './message_actions/emotes/EmoteReactionButton';
import MessageReactionsList from './message_actions/emotes/MessageReactionsList';
import { scrollChatToBottom } from '@/Helpers';
import ReplyMessageButton from './message_actions/replies/ReplyMessageButton';

function SelMessageLine({ text, date, id, reactions, replyingTo }) {

  const [isHovered, setIsHovered] = useState(false);
  const [sent, setSent] = useState(false);
  const {store} = useAppReducer();

  useEffect(() => {
    setTimeout(scrollChatToBottom, 0)

    if (!sent && store.room_code) {
      userSocket.on('message-sent', () => {
        setSent(true);
        userSocket.removeListener('message-sent')
      })
    }
    else setSent(true);
  }, [])

  return (
    <div className={`user-message self ${sent? 'sent' : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className='message-container'>
        <UserMessage date={date} userId={store.user_id} userColor={store.user_color} text={text} messageReplying={replyingTo}/>
        {
          isHovered &&
          <div className='message-actions'>
            <EmoteReactionButton message_id={id} messageReactions={reactions}/>
            <ReplyMessageButton from={store.user_id} color={store.user_color} text={text}/>
          </div>
        }
      </div>
      <MessageReactionsList message_id={id} reactions={reactions}/>
    </div>
  )
}

export default SelMessageLine;