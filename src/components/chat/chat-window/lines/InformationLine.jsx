import { useEffect } from 'react';
import { scrollChatToBottom } from '@/Helpers';
import HoverableTitle from '@/components/overlay/HoverableTitle';
import MessageHour from './MessageHour';

function InformationLine({ text, date }) {

  useEffect(() => {
    scrollChatToBottom();
  }, [])
  
  return (
    <div className='server-log'>
      <div className='message-container'>
        <div className='content-wrapper'>
          <MessageHour date={date}/>
          <span className='from'>{'[Info]:'}</span>
          <span className='text'>{text}</span>
        </div>
        <HoverableTitle title='Only you can see this'>
          {'!'}
        </HoverableTitle>
      </div>
    </div>
)
}

export default InformationLine;