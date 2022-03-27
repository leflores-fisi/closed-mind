import { useEffect } from 'react';
import { scrollChatIfIsNear } from '../../../../Helpers';
import EmoteReactionButton from './EmoteReactionButton';
import MessageReactionsList from './MessageReactionsList';
import UserMessage from './UserMessage';

function MessageLine({ date, userId, userColor, text, id, reactions }) {

  useEffect(() => {
    scrollChatIfIsNear();
  }, [])

  return (
    <div className='user-message'>
      <div className='message-container'>
        <UserMessage date={date} userId={userId} userColor={userColor} text={text}/>
        <EmoteReactionButton message_id={id} messageReactions={reactions}/>
      </div>
      <MessageReactionsList message_id={id} reactions={reactions}/>
    </div>
  )
}

export default MessageLine;