import { useEffect, memo, useRef } from 'react';
import CommandLine   from './lines/CommandLine';
import MessageLine   from './lines/MessageLine';
import ServerLogLine from './lines/ServerLogLine';
import ErrorLine     from './lines/ErrorLine';
import SelfMessageLine from './lines/SelfMessageLine';

function TerminalLines({ lines }) {
  
  const linesRef = useRef();

  useEffect(() => {
    console.log('Rendered all lines!');
    linesRef.current.lastChild?.scrollIntoView();
  })

  return (
    <div className='command-lines-wrapper'>
      <div className='command-lines' ref={linesRef}>
        {
          lines.map((line, i) => {
            console.log('🐌 mapping message...');
            return (
              <CommandLine key={i}>
              {
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
              }
              </CommandLine>
            )
          })
        }
      </div>
    </div>
  );
}
export default memo(TerminalLines);