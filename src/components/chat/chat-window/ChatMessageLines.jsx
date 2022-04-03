import { memo, useRef } from 'react';
import ChatLine from './lines/ChatLine';
import './chat-interactive/ChatInteractive.scss';

function ChatMessageLines({ lines }) {

  const linesRef = useRef();
  const messagesHeightRef = useRef();

  return (
    <div className='chat-lines-wrapper' ref={linesRef}>
      <div className='chat-lines' ref={messagesHeightRef}>
        {
          lines.map((line, i) => {
            console.log('🐌 mapping message...');
            return (
              <ChatLine key={i} line={line}/>
            )
          })
        }
      </div>
    </div>
  );
}
export default memo(ChatMessageLines);