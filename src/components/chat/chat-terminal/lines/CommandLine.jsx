import { useEffect, memo } from 'react';
import MessageLine   from './MessageLine';
import ServerLogLine from './ServerLogLine';
import ErrorLine     from './ErrorLine';
import SelfMessageLine from './SelfMessageLine';
import './TerminalLines.scss';

function CommandLine({ line }) {

  useEffect(() => {
    console.log('🦧 Rendered last command line');
  }, [])

  return (
    line.from === 'Server' ?
      <ServerLogLine
        date={line.date}
        log={line.text}
      />
    : line.from === '@senders/ERROR_HANDLER' ?
      <ErrorLine
        text={line.text}
      />
    : line.from === '@senders/SELF' ?
      <SelfMessageLine
        date={line.date}
        text={line.text}
      />
    :
      <MessageLine
        userId={line.from}
        userColor={line.color}
        text={line.text}
        date={line.date}
      />
  )
}

export default memo(CommandLine);