import { useEffect, useState } from 'react';
import { scrollChatIfIsNear } from '@/Helpers';
import EmoteReactionButton from './message_actions/emotes/EmoteReactionButton';
import MessageReactionsList from './message_actions/emotes/MessageReactionsList';
import UserMessage from './UserMessage';
import ReplyMessageButton from './message_actions/replies/ReplyMessageButton';
import MessageMedia from '../chat-interactive/MessageMedia';

function MessageLine({ date, userId, userColor, text, id, reactions, replyingTo, media }) {

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    scrollChatIfIsNear();
  }, [])

  return (
    <div className='user-message' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className='message-container'>
        <UserMessage date={date} userId={userId} userColor={userColor} text={text} messageReplying={replyingTo}/>
        {
          isHovered &&
          <div className='message-actions'>
            <EmoteReactionButton message_id={id} messageReactions={reactions}/>
            <ReplyMessageButton from={userId} text={text} color={userColor}/>
          </div>
        }
      </div>
      <MessageMedia mediaFiles={media}/>
      <MessageReactionsList message_id={id} reactions={reactions}/>
    </div>
  )
}

export default MessageLine;