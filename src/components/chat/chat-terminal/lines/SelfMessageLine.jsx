import { memo, useEffect, useState } from 'react';
import useAppReducer from '../../../../hooks/useAppReducer';
import { userSocket } from '../../../userSocket';

function SelMessageLine({ text, date }) {

  const [sended, setSended] = useState(false);
  const {store} = useAppReducer();

  let d = '', hour = '', minute = '';
  if (date) {
    d      = new Date(date);
    hour   = new Intl.DateTimeFormat('en', { hour: '2-digit', hour12: false }).format(d);
    minute = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
  }

  useEffect(() => {
    if (!sended && store.room_code) {

      userSocket.on('message-sended', () => {
        setSended(true);
        userSocket.removeListener('message-sended')
      })
    }
    else setSended(true);
    console.log('🦧 Rendered:', text)
  }, [])

  return (
    <div className={`user-message self command-line ${sended? 'sended' : ''}`}>
      <div>
        <time className='date'>{date ? `${hour.replace(/ PM| AM/, '')}:${minute}` : '??:??'}</time>
        <span className={`from ${store.user_color}`}>{`[${store.user_id || '???'}]:`}</span>
        <span className='text'>{text}</span>
      </div>
    </div>
  )
}

export default memo(SelMessageLine);