import { useState, forwardRef, useEffect } from 'react';

function CommandInput(props, ref) {

  const commands = ['/create <room name>', '/connect <room-name>', '/leave', '/ban <dummy>']
  const [autocomplete, setAutocomplete] = useState('');

  console.log('rendering', autocomplete)

  useEffect(() => {
    console.log('saving ref:', ref);
  }, [autocomplete])
  
  const handleOnInput = (e) => {
    let inputLine = e.target.value;
    if (inputLine.startsWith('/')) {
      for (let command of commands) {
        if (command.startsWith(inputLine))
          setAutocomplete(command);
      }
    }
    else setAutocomplete('')
  }

  return (
    <div className='command-line-input'>
      <div>{'>'}</div>
      <div className='input-wrapper'>
        <input
          className='command-input'
          ref={ref}
          onChange={(e) => {
            let inputLine = e.target.value;
            if (inputLine.startsWith('/') && commands.some(command => command.startsWith(inputLine))) {
              for (let command of commands) {
                if (command.startsWith(inputLine))
                  setAutocomplete(command);
              }
            }
            else setAutocomplete('');
          }}
        >
        </input>
        <div className='autocomplete'>{autocomplete}</div>
      </div>
    </div>
  )
}

export default forwardRef(CommandInput);