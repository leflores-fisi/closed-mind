import {  memo, useRef } from 'react';
import CommandLine   from './lines/CommandLine';
import './chat-interactive/ChatInteractive.scss'

function TerminalLines({ lines }) {

  const linesRef = useRef();
  const messagesHeightRef = useRef();

  return (
    <div className='command-lines-wrapper' ref={linesRef}>
      <div className='command-lines' ref={messagesHeightRef}>
        {
          lines.map((line, i) => {
            console.log('🐌 mapping message...');
            return (
              <CommandLine key={i} line={line}/>
            )
          })
        }
      </div>
    </div>
  );
}
export default memo(TerminalLines, (prev, next) => {
  return prev.lines.length === next.lines.length
});