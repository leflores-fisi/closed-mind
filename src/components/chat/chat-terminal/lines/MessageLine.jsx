import UserMessage from './UserMessage';

function MessageLine({ date, userId, userColor, text }) {

  return (
    <div className='command-line user-message'>
      <UserMessage date={date} userId={userId} userColor={userColor} text={text}/>
    </div>
  )
}

export default MessageLine;