
function MessageLine({ username, text, date }) {

  let d = new Date(date);

  let hour = new Intl.DateTimeFormat('en', { hour: '2-digit' }).format(d);
  let minute = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);

  return (
    <div className='user-message command-line'>
      <div>
        <span className='date'>{`${hour.replace(/ PM| AM/, '')}:${minute}`}</span>
        <span className='from'>{`[${username || '???'}]:`}</span>
        <span className='text'>{text}</span>
      </div>
    </div>
  )
}

export default MessageLine