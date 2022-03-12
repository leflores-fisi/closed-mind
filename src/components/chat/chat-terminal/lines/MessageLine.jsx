import useChatConfig from '../../../../hooks/useChatConfig';
import useDateFormatter from '../../../../hooks/useDateFormatter';

function MessageLine({ username, userColor, text, date }) {

  const {userCodeVisible} = useChatConfig();
  const formattedDate = useDateFormatter(date);

  return (
    <div className='command-line user-message'>
      <div>
        <time className='date'>{formattedDate}</time>
        {/* <span className={`from ${userColor || 'default'}`}>{`${username || '???'}:`}</span> */}

        <span className={userColor}>
          {username.substring(0, username.indexOf('#'))}
        </span>
        {
          userCodeVisible && 
            <span className={userColor} style={{opacity: 0.5}}>
              {username.substring(username.indexOf('#'))}
            </span>
        }
        <span className='text'>{' ' + text}</span>
      </div>
    </div>
  )
}

export default MessageLine;