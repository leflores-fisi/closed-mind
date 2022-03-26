import { useEffect, memo } from 'react';
import MessageLine   from './MessageLine';
import ServerLogLine from './ServerLogLine';
import ErrorLine     from './ErrorLine';
import SelfMessageLine from './SelfMessageLine';
import './TerminalLines.scss';
import { emitSocketEvent } from '../../../userSocket';

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
          />
        :
          <MessageLine
            userId={line.from}
            userColor={line.color}
            text={line.text}
            date={line.date}
            id={line.message_id}
          />
      }
      {
        line.reactions?.length > 0 &&
        <div className='reactions-container'>
          {
            line.reactions.map(reaction => {
              return (
                <button key={reaction.emote} className='reaction' onClick={() => {
                  console.log(`(@From down reactions) REACTION TO ${line.message_id} WITH`, reaction.emote);
                  emitSocketEvent['reacting-to-message']({message_id: line.message_id, emote: reaction.emote});
                }}>
                  <span className='emote'>{reaction.emote}</span>
                  <span className='emote-count'>{reaction.count}</span>
                </button>
              )
            })
          }
        </div>
      }
    </div>
  )
}

export default memo(CommandLine);