import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { connectToRoom, disconnectFromRoom, saveLineToHistory, appendMessage, appendUser, popUser, disconnectSocket, appendErrorMessage, clearTerminal } from '../../../context/actions';

import { userSocket } from '../../userSocket'
import useAppReducer  from '../../../hooks/useAppReducer';

import WindowHeader  from '../../WindowHeader';
import CommandInput  from './CommandInput';
import TerminalLines from './TerminalLines';
import './ChatTerminal.scss';

function ChatTerminal({ locationParams = {} }) {

  const inputRef    = useRef(null);
  const terminalRef = useRef(null);
  const {store, dispatch} = useAppReducer();
  const [index, setIndex] = useState(0);
  console.log('🥶 Whole render1')

  useEffect(() => {
    console.log('🥶 Whole render2')
  })
  useLayoutEffect(() => {
    console.log('🥶 Whole render3')
  })

  const CONSOLE_ACTIONS = {
    
    '/create': (args) => {
      if (store.room_id) {
        dispatch(appendErrorMessage({message: 'You are already connected, type "/leave" first'}));
      }
      else if (args.length > 1 || args.length === 0) {
        dispatch(appendErrorMessage({message: `Expected one argument for <room-name>, given ${args.length}`}))
      }
      else {
        let room_name = args[0];
        userSocket.emit('creating-chat-room', {room_name: room_name, host: store.user_id});
      }
    },
    '/join': (args) => {
      if (store.room_id) {
        dispatch(appendErrorMessage({message: 'You are already connected, type "/leave" first'}));
      }
      else if (args.length > 1 || args.length === 0) {
        dispatch(appendErrorMessage({message: `Expected one argument for <room-id>, given ${args.length}`}))
      }
      else  {
        let room_id = args[0];
        userSocket.emit('joining-to-chat', {room_id: room_id, user_id: store.user_id});
      }
    },
    '/ban': (args) => {
      if (!store.room_id) {
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
      if (!store.room_id) {
        dispatch(appendErrorMessage({message: 'You should be on a room first'}));
      }
      else {
        let farewell = args.join(' ');
        userSocket.emit('leaving-from-chat', {
          room_id: store.room_id,
          user_id: store.user_id,
          farewell
        });
      }
    },
    'send_message': (message) => {
      if (!store.room_id) {
        dispatch(appendMessage({date: new Date().toUTCString(), user_id: store.user_id, user_color: store.user_color, message}));
      }
      else {
        terminalRef.current.scrollTo({top: terminalRef.current.scrollHeight, behavior: 'smooth'});
        userSocket.emit('sending-message', {
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
        let user_input = inputRef.current.value;
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

        inputRef.current.value = '';
        dispatch(saveLineToHistory({line: user_input}));
        setIndex(0);
      break;

      case 'ArrowUp':
        setIndex(prev => {
          if (store.commands_history.at(prev-1) !== undefined) {
            inputRef.current.value = store.commands_history.at(prev-1);
            return prev-1;
          }
          return prev;
        })
        e.preventDefault();
        inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        break;
      case 'ArrowDown':
        setIndex(prev => {
          if (store.commands_history.at(prev+1) !==undefined && prev < -1) {
            inputRef.current.value = store.commands_history.at(prev+1);
            return prev+1;
          }
          return prev;
        })
        inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        break;
    }
   
  };

  useEffect(() => {

    console.log('🐢 Setting all socket listeners');

    // if exist a room id on the path (/room/:id) it joins automatically
    if (locationParams.room)
      CONSOLE_ACTIONS['/join']([locationParams.room])

    // listeners to <socket.emit(...)>
    userSocket.on('room-created', ({createdChatRoom}) => {
      dispatch(connectToRoom({chatRoom: createdChatRoom}));
    });
    userSocket.on('joined', (chatRoom) => {
      dispatch(connectToRoom({chatRoom: chatRoom}));
      console.log(chatRoom)
    });
    userSocket.on('message-sended', ({date, user_id, user_color, message}) => {
      dispatch(appendMessage({date, user_id, user_color, message}));
    });
    userSocket.on('disconnected-from-room', () => {
      dispatch(disconnectFromRoom());
    });
    userSocket.on('error', ({message}) => {
      dispatch(appendErrorMessage({message}));
    });

    // listeners to <socket.to(room).emit(...)>
    userSocket.on('user-connected', ({date, user_id}) => {
      dispatch(appendUser({date: date, user_id: user_id}));
    });
    userSocket.on('user-disconnected', ({user_id, server_log}) => {
      dispatch(popUser({user_id, server_log}));
    });

    // socket.io events
    userSocket.on('disconnect', () => {

      if (store.room_id)  {
        console.log('Disconnecting with room code: {room_id:', store.room_id, ', user:', store.user_id,'}');
        dispatch(disconnectFromRoom());
        dispatch(disconnectSocket({}));
      }
      else {
        dispatch(disconnectSocket({}))
        console.log('Disconnecting without room code...');
      }
    });
    userSocket.on('connect_error', (err) => {
      console.log('CONNECTION ERROR:', err.message);
      setTimeout(() => {
        userSocket.connect();
      }, 1000);
    });
    
    return () => {
      userSocket.removeAllListeners();
      console.log('🐌 Removing all socket listeners');
    };

  }, [store.room_id])

  useEffect(() => {
    console.log('Setting up key event listener (handleCommands)')

    inputRef.current.focus();
    inputRef.current.addEventListener('keydown', handleCommands);
    return () => {
      if (inputRef.current)
        inputRef.current.removeEventListener('keydown', handleCommands);
    }
  }, [store.commands_history, store.room_id]);

  return (
    <div className='chat-terminal'
      onMouseUp={(e) => {
        if (window.getSelection().toString() === '')
          inputRef.current.focus()
      }}
      ref={terminalRef}
    >
      <WindowHeader title='Chat'/>
      <TerminalLines lines={store.messages}/>
      <CommandInput ref={inputRef}/>
    </div>
  );
}

export default ChatTerminal;