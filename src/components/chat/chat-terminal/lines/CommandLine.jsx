import { useEffect, memo } from 'react';
import MessageLine     from './MessageLine';
import ServerLogLine   from './ServerLogLine';
import ErrorLine       from './ErrorLine';
import SelfMessageLine from './SelfMessageLine';
import './TerminalLines.scss';

function CommandLine({ line }) {

  useEffect(() => {
    console.log('🦧 Rendered last command line');
  }, [])

  return (
    <div className='command-line'>
      {
        line.from === 'Server' ?
          <ServerLogLine
            date={line.date}
            log={line.text}
            id={line.message_id}
            reactions={line.reactions}
          />
        : line.from === '@senders/ERROR_HANDLER' ?
          <ErrorLine
            text={line.text}
          />
        : line.from === '@senders/SELF' ?
          <SelfMessageLine
            date={line.date}
            text={line.text}
            id={line.message_id}
            reactions={line.reactions}
          />
        :
          <MessageLine
            userId={line.from}
            userColor={line.color}
            text={line.text}
            date={line.date}
            id={line.message_id}
            reactions={line.reactions}
          />
      }
    </div>
  )
}

export default memo(CommandLine);