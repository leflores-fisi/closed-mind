import { useEffect, useState } from 'react';
import { userSocket } from '../../../userSocket';
import useAppReducer from '../../../../hooks/useAppReducer';
import useChatConfig from '../../../../hooks/useChatConfig';
import useDateFormatter from '../../../../hooks/useDateFormatter';

function SelMessageLine({ text, date }) {

  const {userCodeVisible} = useChatConfig();
  const [sent, setSent] = useState(false);
  const {store} = useAppReducer();
  const formattedDate = useDateFormatter(date);

  useEffect(() => {
    if (!sent && store.room_code) {
      userSocket.on('message-sent', () => {
        setSent(true);
        userSocket.removeListener('message-sent')
      })
    }
    else setSent(true);
  }, [])

  return (
    <div className={`command-line user-message self ${sent? 'sent' : ''}`}>
      <time className='date'>{formattedDate}</time>
      <div>
        {/* <span className={`from ${store.user_color}`}>{`[${store.user_id || '???'}]:`}</span> */}

        <span className={store.user_color}>
          {store.user_id.substring(0, store.user_id.indexOf('#'))}
        </span>
        {
          userCodeVisible && 
            <span className={store.user_color} style={{opacity: 0.5}}>
              {store.user_id.substring(store.user_id.indexOf('#'))}
            </span>
        }
        <span className='text'>{' ' + text}</span>
      </div>
    </div>
  )
}

export default SelMessageLine;