import { useEffect,  useRef, useState } from "react";
import { nanoid } from "nanoid";
import { connectToRoom, disconnectFromRoom, saveLineToHistory, appendMessage, appendUser, popUser, disconnectSocket } from "../../context/actions";
import useAppReducer from "../../hooks/useAppReducer";
import CommandInput from "./CommandInput";
import CommandLine from "./CommandLine";
import MessageLine from "./MessageLine";
import {userSocket} from '../userSocket'
import ServerLogLine from "./ServerLogLine";
import './ChatTerminal.scss'

function ChatTerminal() {

  const inputRef = useRef(null);
  const {store, dispatch} = useAppReducer();
  const [index, setIndex] = useState(0);

  const CONSOLE_ACTIONS = {
    "/create": () => {
      userSocket.emit('creating-chat-room', {host: store.user_id})
    },
    "/connect": (id) => {
      userSocket.emit('joining-to-chat', {room_id: id, user_id: store.user_id});
    },
    "/leave": () => {
      userSocket.emit('leaving-from-chat', {room_id: store.room_id, user_id: store.user_id});
    },
    "send_message": (message) => {
      if (store.is_connected)
        userSocket.emit('sending-message', {user_id: store.user_id, message: message})
    }
  };

  const handleCommands = (e) => {

    switch (e.key) {
      case 'Enter':
        let user_input = inputRef.current.value;

        if (user_input.startsWith('/')) {
          let args = user_input.split(' ');
          let command = args[0];
          if (CONSOLE_ACTIONS.hasOwnProperty(command)) {
            CONSOLE_ACTIONS[command](args[1]);
          }
        }
        else {
          if (user_input) {
            CONSOLE_ACTIONS['send_message'](user_input);
          }
        }
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
        break;
      case 'ArrowDown':
        setIndex(prev => {
          if (store.commands_history.at(prev+1) !==undefined && prev < -1) {
            inputRef.current.value = store.commands_history.at(prev+1);
            return prev+1;
          }
          return prev;
        })
        break;
    }
   
  };

  useEffect(() => {

    userSocket.on('room-created', ({createdChatRoom}) => {
      dispatch(connectToRoom({chatRoom: createdChatRoom}));
      console.log(createdChatRoom);
    })
    userSocket.on('joined', (chatRoom) => {
      dispatch(connectToRoom({chatRoom: chatRoom}));
    })
    userSocket.on('message-sended', ({date, user_id, message}) => {
      dispatch(appendMessage({date, user_id, message}));
    })
    userSocket.on('disconnected', () => {
      dispatch(disconnectFromRoom());
    })

    // listeners to <socket.to(room).emit(...)> from backend
    userSocket.on('user-connected', ({date, user_id}) => {
      dispatch(appendUser({date: date, user_id: user_id}))
    })
    userSocket.on('user-disconnected', ({date, user_id}) => {
      dispatch(popUser({date: date, user_id: user_id}))
    })

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
    })
    userSocket.on("connect_error", (err) => {
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
    inputRef.current.addEventListener('keydown', handleCommands);
    return () => {
      if (inputRef.current)
        inputRef.current.removeEventListener('keydown', handleCommands);
    }
  }, [store.commands_history, index, store.room_id, store.user_id]);

  return (
    <div className='chat-terminal' onMouseUp={(e) => {
      if (!e.target.classList.contains('command-line__text'))
        inputRef.current.focus()
    }}>
      <div className='command-lines'>

        <CommandLine text={'〰Closed mind〰 [v1.0]'}/>
        <CommandLine text={'(c) Leflores-fisi. All rights reserved.'}/>
        {
          store.messages.map(messageDB => (
            messageDB.from === 'Server' ?
              <ServerLogLine
                date={messageDB.date}
                log={messageDB.text}
                key={nanoid()}
              />
              :
              <MessageLine
                username={messageDB.from}
                text={messageDB.text}
                date={messageDB.date}
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