import { nanoid } from 'nanoid';
import { memo } from 'react';
import CommandLine   from './lines/CommandLine';
import MessageLine   from './lines/MessageLine';
import ServerLogLine from './lines/ServerLogLine';
import ErrorLine     from './lines/ErrorLine';
import useAppReducer from '../../../hooks/useAppReducer';

function TerminalLines({ lines }) {
  
  return (
    <div className='command-lines'>
      <CommandLine text={'〰Closed mind〰 v1.0'}/>
      <CommandLine text={'Type "/commands" to see all the commands'}/>
      {
        lines.map((DBmessage, i) => {
          console.log('🐌 mapping message...')
          return (
            DBmessage.from === 'Server' ?
              <ServerLogLine
                date={DBmessage.date}
                log={DBmessage.text}
                key={i}
              />
            : DBmessage.from === 'ErrorHandler' ?
              <ErrorLine
                text={DBmessage.text}
                key={i}
              />
            :
              <MessageLine
                username={DBmessage.from}
                userColor={DBmessage.color}
                text={DBmessage.text}
                date={DBmessage.date}
                key={i}
              />
          )
        })
      }
    </div>
  );
}
export default memo(TerminalLines);