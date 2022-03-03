
function MessageLine({ username, userColor, text, date }) {

  let d, hour, minute;
  if (date) {
    d = new Date(date);
    hour = new Intl.DateTimeFormat('en', { hour: '2-digit', hour12: false }).format(d);
    minute = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
  }

  return (
    <div className='user-message command-line'>
      <div>
        {date && <span className='date'>{`${hour.replace(/ PM| AM/, '')}:${minute}`}</span>}
        <span className={`from ${userColor}`}>{`[${username || '???'}]:`}</span>
        <span className='text'>{text}</span>
      </div>
    </div>
  )
}

export default MessageLine;