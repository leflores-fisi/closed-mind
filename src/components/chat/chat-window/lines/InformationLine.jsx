import { useEffect } from 'react';
import { scrollChatToBottom } from '@/Helpers';
import HoverableTitle from '@/components/overlay/HoverableTitle';
import useDateFormatter from '@/hooks/useDateFormatter';

function InformationLine({ text, date }) {

  const formattedDate = useDateFormatter(date); 

  useEffect(() => {
    scrollChatToBottom();
  }, [])
  
  return (
    <div className='server-log'>
      <div className='message-container'>
        <div className='content-wrapper'>
          <time className='date'>{formattedDate}</time>
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