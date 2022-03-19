import { useEffect, memo, useRef } from 'react';
import CommandLine   from './lines/CommandLine';

function TerminalLines({ lines }) {

  const linesRef = useRef();
  const messagesHeightRef = useRef();

  useEffect(() => {
    const Wrapper = document.querySelector('.command-lines-wrapper');
    const Lines = document.querySelector('.command-lines');
    //Wrapper.scrollTo(0, Lines.getBoundingClientRect().height);
  }, [])

  useEffect(() => {
    console.log('Rendered all lines!');
    //linesRef.current.lastChild?.scrollIntoView();
    const Wrapper = document.querySelector('.command-lines-wrapper');
    const Lines = document.querySelector('.command-lines');

    if (Lines.getBoundingClientRect().height - (Wrapper.scrollTop + Wrapper.getBoundingClientRect().height) < 200) {
      Wrapper.scrollTo(0, Lines.getBoundingClientRect().height);
    }
  })

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