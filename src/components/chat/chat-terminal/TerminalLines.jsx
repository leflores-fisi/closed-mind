import { useEffect, memo, useRef } from 'react';
import CommandLine   from './lines/CommandLine';

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