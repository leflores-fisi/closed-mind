import { useState, forwardRef, useEffect } from 'react';
import useAppReducer from '../../../hooks/useAppReducer';

function CommandInput(props, ref) {

  const {store} = useAppReducer();
  const commands = ['/create <room name>', '/join <room-name>', '/leave', '/ban <dummy>']
  const [autocomplete, setAutocomplete] = useState('');

  useEffect(() => {
    console.log('Autocompleted')
  })

  return (
    <div className='command-line-input'>
      <div>{'>'}</div>
      <div className='input-wrapper'>
        <input
          className='command-input'
          ref={ref}
          onChange={(e) => {
            let inputLine = e.target.value;
            let availableCommands = commands.concat(store.users.filter(user => user.user_id !== store.user_id).map(user => `/ban ${user.user_id}`))
            
            if (inputLine.startsWith('/') && availableCommands.some(command => command.startsWith(inputLine))) {
              if (inputLine === '/') {
                setAutocomplete('/commands');
                return;
              };
              for (let command of availableCommands) {
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