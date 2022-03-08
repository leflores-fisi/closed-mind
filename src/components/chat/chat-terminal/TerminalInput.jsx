import { useState, forwardRef, useRef, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { userSocket } from '../../userSocket';
import useAppReducer from '../../../hooks/useAppReducer';
import { saveLineToHistory, appendMessage, appendErrorMessage, clearTerminal } from '../../../context/actions';
import './TerminalInput.scss';

function CommandInput(props, ref) {

  const {store, dispatch} = useAppReducer();
  const commands = ['/create <room-code>', '/join <room-code>', '/leave', '/ban <dummy>'];
  const [autocomplete, setAutocomplete] = useState('');
  const [historyIndex, setHistoryIndex] = useState(0);
  const focusedRow = useRef(0);

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
      // If is not connected, only appends the message
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
    if (e.shiftKey) return;

    focusedRow.current = ref.current.value.substring(0, ref.current.selectionEnd).split('\n').length;
    let total_rows = ref.current.value.split('\n').length;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        let user_input = ref.current.value.trim();
        if (!user_input) return;

        if (user_input.startsWith('/')) {
          let words   = user_input.split(' ');
          let command = words[0];
          let args    = words.slice(1);
          
          if (!CONSOLE_ACTIONS.hasOwnProperty(command))
            dispatch(appendErrorMessage({message: `Command '${command}' not recognized, type "/commands" for a hug`}));
          else CONSOLE_ACTIONS[command](args);
        }
        else CONSOLE_ACTIONS['send_message'](user_input);

        ref.current.value = '';
        dispatch(saveLineToHistory({line: user_input}));
        setHistoryIndex(0);
      break;

      case 'ArrowUp':
        // "If exist the line on history AND (the input has multiple lines and you are on the top OR you have only one line)"
        if ((store.commands_history.at(historyIndex-1) !== undefined)
          && ((total_rows > 0 && ref.current.selectionStart === 0) || (total_rows === 1))) {
            
          ref.current.value = store.commands_history.at(historyIndex-1);
          setHistoryIndex(prev => prev-1);
          ref.current.setSelectionRange(ref.current.value.length, ref.current.value.length);
          e.preventDefault();
        }
        break;
      case 'ArrowDown':
        // "If exist the line on history AND the index will not go out of range AND caret is in the bottom row"
        if ((store.commands_history.at(historyIndex+1) !== undefined)
          && (historyIndex < -1)
          && (focusedRow.current === total_rows)) {

          ref.current.value = store.commands_history.at(historyIndex+1);
          setHistoryIndex(prev => prev+1);
          ref.current.setSelectionRange(ref.current.value.length, ref.current.value.length);
          e.preventDefault();
        }
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
  const handleNewLine = () => {
    focusedRow.current = ref.current.value.substring(0, ref.current.selectionEnd).split('\n').length;
  }

  return (
    <div className='terminal-input-container'>
      <div>{'>'}</div>
      <div className='input-wrapper'>
        <TextareaAutosize
          className='textarea-input'
          ref={ref}
          placeholder={'Type something'}
          onChange={handleChange}
          onKeyDown={handleCommands}
          onHeightChange={handleNewLine}
        />
        <div className='autocomplete'>{autocomplete}</div>
      </div>
    </div>
  )
}

export default forwardRef(CommandInput);