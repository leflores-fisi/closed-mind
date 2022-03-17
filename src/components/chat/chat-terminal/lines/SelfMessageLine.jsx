import { useEffect, useState } from 'react';
import { userSocket } from '../../../userSocket';
import useAppReducer from '../../../../hooks/useAppReducer';
import UserMessage from './UserMessage';

function SelMessageLine({ text, date }) {

  const [sent, setSent] = useState(false);
  const {store} = useAppReducer();

  useEffect(() => {
    if (!sent && store.room_code) {
      userSocket.on('message-sent', () => {
        setSent(true);
        userSocket.removeListener('message-sent')
      })
    }
    else setSent(true);
  }, [])
  console.log('self')

  return (
    <div className={`command-line user-message self ${sent? 'sent' : ''}`}>
      <UserMessage date={date} userId={store.user_id} userColor={store.user_color} text={text}/>
    </div>
  )
}

export default SelMessageLine;