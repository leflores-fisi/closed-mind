import { useEffect } from 'react';
import EmoteReactionButton from './EmoteReactionButton';
import MessageReactionsList from './MessageReactionsList';
import UserMessage from './UserMessage';

function MessageLine({ date, userId, userColor, text, id, reactions }) {

  useEffect(() => {
    const Wrapper = document.querySelector('.command-lines-wrapper');
    const Lines   = document.querySelector('.command-lines');

    if (Lines.getBoundingClientRect().height - (Wrapper.scrollTop + Wrapper.getBoundingClientRect().height) < 200) {
      setTimeout(() => {
        Wrapper.scrollTo(0, Lines.getBoundingClientRect().height);
      }, 0)
    }
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