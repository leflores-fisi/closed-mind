import { useEffect } from 'react';
import UserMessage from './UserMessage';

function MessageLine({ date, userId, userColor, text }) {

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
    <div className='command-line user-message'>
      <UserMessage date={date} userId={userId} userColor={userColor} text={text}/>
    </div>
  )
}

export default MessageLine;