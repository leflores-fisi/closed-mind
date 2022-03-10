import { nanoid } from 'nanoid';
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
    linesRef.current.lastChild.scrollIntoView()
  })

  return (
    <div className='command-lines' ref={linesRef}>
      <CommandLine text={'〰Closed mind〰 v1.0'}/>
      <CommandLine text={'Type "/commands" to see all the commands'}/>
      {
        lines.map((line, i) => {
          console.log('🐌 mapping message...')
          return (
            line.from === 'Server' ?
              <ServerLogLine
                date={line.date}
                log={line.text}
                key={i}
              />
            : line.from === 'ErrorHandler' ?
              <ErrorLine
                text={line.text}
                key={i}
              />
            : line.from === '@senders/SELF' ?
              <SelfMessageLine
                date={line.date}
                text={line.text}
                key={i}
              />
            :
              <MessageLine
                username={line.from}
                userColor={line.color}
                text={line.text}
                date={line.date}
                isSended={line.sended}
                key={i}
              />
          )
        })
      }
    </div>
  );
}
export default memo(TerminalLines);