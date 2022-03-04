import { useEffect,  useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { connectToRoom, disconnectFromRoom, saveLineToHistory, appendMessage, appendUser, popUser, disconnectSocket, appendErrorMessage, clearTerminal } from '../../context/actions';
import {userSocket} from '../userSocket'
import useAppReducer from '../../hooks/useAppReducer';
import CommandInput from './CommandInput';
import CommandLine from './CommandLine';
import MessageLine from './MessageLine';
import ServerLogLine from './ServerLogLine';
import WindowHeader from './../WindowHeader';
import './ChatTerminal.scss';
import ErrorLine from './ErrorLine';

function ChatTerminal() {

  const inputRef = useRef(null);
  const {store, dispatch} = useAppReducer();
  const [index, setIndex] = useState(0);

  const CONSOLE_ACTIONS = {
    '/create': (args) => {
      if (args.length > 1 || args.length === 0) {
        dispatch(appendErrorMessage({message: `Expected one argument for <room-name>, given ${args.length}`}))
      }
      else {
        let room_name = args[0];
        userSocket.emit('creating-chat-room', {room_name: room_name, host: store.user_id});
      }
    },
    '/join': (args) => {
      if (args.length > 1 || args.length === 0) {
        dispatch(appendErrorMessage({message: `Expected one argument for <room-id>, given ${args.length}`}))
      }
      else if (!store.room_id) {
        userSocket.emit('joining-to-chat', {room_id: room_id, user_id: store.user_id});
      }
      else dispatch(appendErrorMessage({message: 'You are already connected, type "/leave" first'}));
    },
    '/ban': (args) => {
      if (args.length > 1 || args.length === 0) {
        dispatch(appendErrorMessage({message: `Expected one argument for <dummy-user>, given ${args.length}`}))
      }
      else if (!store.room_id) {
        dispatch(appendErrorMessage({message: 'There are no dummies near, use "/join" first'}));
        return;
      }
      else {
        let user_id = args[0];
        if (store.user_id === store.host) console.log('Banning', user_id);
        else dispatch(appendErrorMessage({message: 'Only the host can use the ban hammer!'}));
      }
    },
    '/clear': () => {
      dispatch(clearTerminal());
    },
    '/leave': (args) => {
      if (store.room_id) {
        let farewell = args.join(' ');
        userSocket.emit('leaving-from-chat', {room_id: store.room_id, user_id: store.user_id});
      }
      else dispatch(appendErrorMessage({message: 'You should be on a room first'}));
    },
    'send_message': (message) => {
      if (store.room_id) {
        userSocket.emit('sending-message', {user_id: store.user_id, user_color: store.user_color, message: message});
      }
      else dispatch(appendMessage({date: new Date().toUTCString(), user_id: store.user_id, user_color: store.user_color, message}));
    }
  };

  const handleCommands = (e) => {

    switch (e.key) {
      case 'Enter':
        let user_input = inputRef.current.value;
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

    // listeners to <socket.emit(...)>
    userSocket.on('room-created', ({createdChatRoom}) => {
      dispatch(connectToRoom({chatRoom: createdChatRoom}));
      console.log(createdChatRoom);
    });
    userSocket.on('joined', (chatRoom) => {
      dispatch(connectToRoom({chatRoom: chatRoom}));
    });
    userSocket.on('message-sended', ({date, user_id, user_color, message}) => {
      dispatch(appendMessage({date, user_id, user_color, message}));
    });
    userSocket.on('disconnected', () => {
      dispatch(disconnectFromRoom());
    });
    userSocket.on('error', ({message}) => {
      dispatch(appendErrorMessage({message}));
    });

    // listeners to <socket.to(room).emit(...)>
    userSocket.on('user-connected', ({date, user_id}) => {
      dispatch(appendUser({date: date, user_id: user_id}))
    });
    userSocket.on('user-disconnected', ({date, user_id}) => {
      dispatch(popUser({date: date, user_id: user_id}))
    });

    // socket.io events
    userSocket.on('disconnect', () => {
      console.log('DISCONNECTING WITH OLD STORE??:', store);
      if (store.room_id)  {
        dispatch(disconnectFromRoom());
        dispatch(disconnectSocket({}))
        userSocket.emit('leaving-from-chat', {room_id: store.room_id, user: store.user_id});
        console.log('disconnecting 1...', store.room_id)
      }
      else {
        dispatch(disconnectSocket({}))
        console.log('disconnecting 2...', store);
      }
    });
    userSocket.on('connect_error', (err) => {
      console.log('CONNECTION ERROR:', err.message);
      setTimeout(() => {
        userSocket.connect();
      }, 1000);
    });
    
    userSocket.onAny((event, ...args) => {
      console.log('Incoming:', event, args);
    });
    return () => userSocket.removeAllListeners()

  }, [store.room_id])

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.addEventListener('keydown', handleCommands);
    return () => {
      if (inputRef.current)
        inputRef.current.removeEventListener('keydown', handleCommands);
    }
  }, [store.commands_history, index, store.room_id, store.user_id]);

  return (
    <div className='chat-terminal' onMouseUp={(e) => {
      if (window.getSelection().toString() === '')
        inputRef.current.focus()
    }}>
      <WindowHeader title='Chat'/>
      <div className='command-lines'>

        <CommandLine text={'〰Closed mind〰 v1.0'}/>
        <CommandLine text={'Type "/commands" to see all the commands'}/>
        {
          store.messages.map(DBmessage => (
            DBmessage.from === 'Server' ?
              <ServerLogLine
                date={DBmessage.date}
                log={DBmessage.text}
                key={nanoid()}
              />
            : DBmessage.from === 'ErrorHandler' ?
              <ErrorLine
                text={DBmessage.text}
                key={nanoid()}
              />
            :
              <MessageLine
                username={DBmessage.from}
                userColor={DBmessage.color}
                text={DBmessage.text}
                date={DBmessage.date}
                key={nanoid()}
              />
          ))
        }
      </div>
      <CommandInput ref={inputRef}/>
    </div>
  );
}

export default ChatTerminal;