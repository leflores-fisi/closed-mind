import { useState, forwardRef, useRef, useEffect } from 'react';
import { userSocket } from '../../userSocket';
import useAppReducer from '../../../hooks/useAppReducer';
import { saveLineToHistory, appendMessage, appendErrorMessage, clearTerminal } from '../../../context/actions';


function CommandInput(props, ref) {

  const {store, dispatch} = useAppReducer();
  const commands = ['/create <room-code>', '/join <room-code>', '/leave', '/ban <dummy>']
  const [autocomplete, setAutocomplete] = useState('');
  const index = useRef(0)

  useEffect(() => {
    console.log('Autocompleted')
  })

  const CONSOLE_ACTIONS = {
    
    '/create': (args) => {
      if (store.room_code) {
        dispatch(appendErrorMessage({message: 'You are already connected, type "/leave" first'}));
      }
      else if (args.length > 1 || args.length === 0) {
        dispatch(appendErrorMessage({message: `Expected one argument for <room-code>, given ${args.length}`}))
      }
      else {
        let room_name = args[0];
        userSocket.emit('creating-chat-room', {room_name: room_name, host: store.user_id});
      }
    },
    '/join': (args) => {
      if (store.room_code) {
        dispatch(appendErrorMessage({message: 'You are already connected, type "/leave" first'}));
      }
      else if (args.length > 1 || args.length === 0) {
        dispatch(appendErrorMessage({message: `Expected one argument for <room-code>, given ${args.length}`}))
      }
      else  {
        let room_code = args[0];
        userSocket.emit('joining-to-chat', {room_code, user_id: store.user_id});
      }
    },
    '/ban': (args) => {
      if (!store.room_code) {
        dispatch(appendErrorMessage({message: 'There are no dummies near, use join to a room first'}));
      }
      else if (store.user_id !== store.host) {
        dispatch(appendErrorMessage({message: 'Only the host can use the ban hammer!'}));
      }
      else if (args.length === 0) {
        dispatch(appendErrorMessage({message: `Expected one or more arguments for <dummy-users>, given ${args.length}`}))
      }
      else {
        let dummies = args;
        console.log('Banning dummies:', dummies, 'from', store.users);

        for (let dummy_id of dummies) {
          if (store.users.some(user => user.user_id === dummy_id))
            userSocket.emit('banning-user', {user_id: dummy_id, reason: ' Im sorry...'});
          else dispatch(appendErrorMessage({message: `This is shameful, ${dummy_id} does'nt exist`}));
        }
      }
    },
    '/clear': () => {
      dispatch(clearTerminal());
    },
    '/leave': (args) => {
      if (!store.room_code) {
        dispatch(appendErrorMessage({message: 'You should be on a room first'}));
      }
      else {
        let farewell = args.join(' ');
        userSocket.emit('leaving-from-chat', {
          room_code: store.room_code,
          user_id: store.user_id,
          farewell
        });
      }
    },
    'send_message': (message) => {
      let date = new Date().toUTCString();
      if (!store.room_code) {
        dispatch(appendMessage({
          date,
          from: '@senders/SELF',
          text: message
        }));
      }
      else {
        dispatch(appendMessage({
          date,
          from: '@senders/SELF',
          text: message
        }));
        userSocket.emit('sending-message', {
          date: date,
          user_id: store.user_id,
          user_color: store.user_color,
          message: message
        });
      }
    }
  };

  const handleCommands = (e) => {

    switch (e.key) {
      case 'Enter':
        let user_input = ref.current.value;
        if (!user_input) return;

        if (user_input.trim().startsWith('/')) {
          let words   = user_input.trim().split(' ');
          let command = words[0];
          let args    = words.slice(1);
          
          if (!CONSOLE_ACTIONS.hasOwnProperty(command))
            dispatch(appendErrorMessage({message: `Command '${command}' not recognized, type "/commands" for a hug`}));
          else CONSOLE_ACTIONS[command](args);
        }
        else CONSOLE_ACTIONS['send_message'](user_input);

        ref.current.value = '';
        dispatch(saveLineToHistory({line: user_input}));
        index.current = 0;
      break;

      case 'ArrowUp':
        console.log(index.current)
        if (store.commands_history.at(index.current-1) !== undefined) {
          ref.current.value = store.commands_history.at(index.current-1);
          index.current -= 1;
        }
        e.preventDefault();
        ref.current.setSelectionRange(ref.current.value.length, ref.current.value.length);
        break;
      case 'ArrowDown':
        console.log(index.current)
        if (store.commands_history.at(index.current+1) !== undefined && index.current < -1) {
          ref.current.value = store.commands_history.at(index.current+1);
          index.current += 1;
        }
        ref.current.setSelectionRange(ref.current.value.length, ref.current.value.length);
        break;
    }
  };
  
  const handleChange = (e) => {
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
  }

  return (
    <div className='command-line-input'>
      <div>{'>'}</div>
      <div className='input-wrapper'>
        <input
          className='command-input'
          ref={ref}
          onChange={handleChange}
          onKeyDown={handleCommands}
        >
        </input>
        <div className='autocomplete'>{autocomplete}</div>
      </div>
    </div>
  )
}

export default forwardRef(CommandInput);