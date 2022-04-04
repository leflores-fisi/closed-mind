import { useEffect, memo } from 'react';
import MessageLine     from './MessageLine';
import ServerLogLine   from './ServerLogLine';
import ErrorLine       from './ErrorLine';
import SelfMessageLine from './SelfMessageLine';
import InformationLine from './InformationLine';
import './ChatLines.scss';

function ChatLine({ line }) {

  useEffect(() => {
    console.log('🦧 Rendered last chat line');
  }, [])

  return (
    <div className='chat-line-item'>
      {
        line.from === '@senders/SERVER' ?
          <ServerLogLine
            date={line.date}
            log={line.text}
            id={line.message_id}
            reactions={line.reactions}
          />
        : line.from === '@senders/APP_INFO' ?
          <InformationLine
            text={line.text}
            date={line.date}
          />
        : line.from === '@senders/ERROR_HANDLER' ?
          <ErrorLine
            text={line.text}
          />
        : line.from === '@senders/SELF' ?
          <SelfMessageLine
            date={line.date}
            id={line.message_id}
            text={line.text}
            reactions={line.reactions}
            replyingTo={line.replyingTo}
            media={line.media}
          />
        :
          <MessageLine
            date={line.date}
            id={line.message_id}
            userId={line.from}
            userColor={line.color}
            text={line.text}
            reactions={line.reactions}
            replyingTo={line.replyingTo}
            media={line.media}
          />
      }
    </div>
  )
}

export default memo(ChatLine);