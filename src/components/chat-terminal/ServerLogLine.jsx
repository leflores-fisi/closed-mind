import React from 'react'

function ServerLogLine({date, log}) {

  let d = new Date(date);
  
  let hour = new Intl.DateTimeFormat('en', { hour: '2-digit', hour12: false }).format(d);
  let minute = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
  
  return (
    <div className='server-log command-line'>
      <div>
        <span className='date'>{`${hour.replace(/ PM| AM/, '')}:${minute}`}</span>
        <span className='from'>{`[Server]:`}</span>
        <span className='text'>{log}</span>
      </div>
    </div>
  )
}

export default ServerLogLine