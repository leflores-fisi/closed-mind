import useChatConfig from '../../../../hooks/useChatConfig';
import useDateFormatter from '../../../../hooks/useDateFormatter';

function ServerLogLine({date, log}) {
  
  const {serverLogVisible} = useChatConfig();
  const formattedDate = useDateFormatter(date);
  
  return (
    serverLogVisible ?
      <div className='command-line server-log'>
        <div>
          <time className='date'>{formattedDate}</time>
          <span className='from'>{'[Server]:'}</span>
          <span className='text'>{log}</span>
        </div>
      </div>
    : (null)
  )
}

export default ServerLogLine