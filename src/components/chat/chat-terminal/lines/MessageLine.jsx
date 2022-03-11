import { memo, useEffect } from 'react';

function MessageLine({ username, userColor, text, date }) {

  let d = '', hour = '', minute = '';
  if (date) {
    d      = new Date(date);
    hour   = new Intl.DateTimeFormat('en', { hour: '2-digit', hour12: false }).format(d);
    minute = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
  }
  useEffect(() => {
    console.log('🦧 Rendered:', text)
  }, [])

  return (
    <div className='user-message command-line'>
      <div>
        <time className='date'>{date ? `${hour.replace(/ PM| AM/, '')}:${minute}` : '??:??'}</time>
        <span className={`from ${userColor || 'default'}`}>{`[${username || '???'}]:`}</span>
        <span className='text'>{text}</span>
      </div>
    </div>
  )
}

export default memo(MessageLine);