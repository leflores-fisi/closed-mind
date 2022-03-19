import { useEffect } from 'react';
import useChatConfig from '../../../../hooks/useChatConfig';
import useDateFormatter from '../../../../hooks/useDateFormatter';

function ServerLogLine({date, log}) {
  
  const {serverLogVisible} = useChatConfig();
  const formattedDate = useDateFormatter(date);

  useEffect(() => {
    const Wrapper = document.querySelector('.command-lines-wrapper');
    const Lines   = document.querySelector('.command-lines');

    if (Lines.getBoundingClientRect().height - (Wrapper.scrollTop + Wrapper.getBoundingClientRect().height) < 200) {
      Wrapper.scrollTo(0, Lines.getBoundingClientRect().height);
    }
  }, [])
  
  return (
    serverLogVisible &&
      <div className='command-line server-log'>
      <div>
        <time className='date'>{formattedDate}</time>
        <span className='from'>{'[Server]:'}</span>
        <span className='text'>{log}</span>
      </div>
    </div>
)
}

export default ServerLogLine