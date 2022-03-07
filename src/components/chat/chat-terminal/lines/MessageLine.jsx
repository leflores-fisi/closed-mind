import { memo, useEffect } from 'react';

function MessageLine({ username, userColor, text, date }) {

  console.log('🦧', text)

  let d = '', hour = '', minute = '';
  if (date) {
    d      = new Date(date);
    hour   = new Intl.DateTimeFormat('en', { hour: '2-digit', hour12: false }).format(d);
    minute = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
  }
  useEffect(() => {
    console.log('🦧 Finished message render')
  })

  return (
    <div className='user-message command-line'>
      <div>
        <time className='date'>{date ? `${hour.replace(/ PM| AM/, '')}:${minute}` : '??:??'}</time>
        <span className={`from ${userColor}`}>{`[${username || '???'}]:`}</span>
        <span className='text'>{text}</span>
      </div>
    </div>
  )
}

export default memo(MessageLine);