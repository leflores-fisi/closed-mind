import { useEffect } from 'react';
import { scrollChatToBottom } from '@/Helpers';

function ErrorLine({ text }) {

  useEffect(() => {
    scrollChatToBottom();
  }, [])

  return (
    <div className='error-message'>
      <div>{text}</div>
    </div>
  )
}

export default ErrorLine;