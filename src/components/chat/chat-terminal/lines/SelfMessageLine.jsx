import { useEffect, useState } from 'react';
import { userSocket } from '../../../userSocket';
import useAppReducer from '../../../../hooks/useAppReducer';
import UserMessage from './UserMessage';

function SelMessageLine({ text, date }) {

  const [sent, setSent] = useState(false);
  const {store} = useAppReducer();

  useEffect(() => {
    const Wrapper = document.querySelector('.command-lines-wrapper');
    const Lines   = document.querySelector('.command-lines');

    setTimeout(() => {
      Wrapper.scrollTo(0, Lines.getBoundingClientRect().height);
    }, 0)

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
      <UserMessage date={date} userId={store.user_id} userColor={store.user_color} text={text}/>
    </div>
  )
}

export default SelMessageLine;