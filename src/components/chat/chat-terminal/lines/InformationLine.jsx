import { useEffect } from 'react';
import { scrollChatToBottom } from '../../../../Helpers';
import useDateFormatter from '../../../../hooks/useDateFormatter';
import HoverableTitle from '../../../overlay/HoverableTitle';

function InformationLine({ text, date }) {

  const formattedDate = useDateFormatter(date); 

  useEffect(() => {
    scrollChatToBottom();
  }, [])
  
  return (
    <div className='server-log'>
      <div className='message-container'>
        <div>
          <time className='date'>{formattedDate}</time>
          <span className='from'>{'[Info]:'}</span>
          <span className='text'>{text}</span>
        </div>
        <HoverableTitle title='Only you can see this'>
          {'👁'}
        </HoverableTitle>
      </div>
    </div>
)
}

export default InformationLine;