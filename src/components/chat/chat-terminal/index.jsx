import { useEffect, useRef } from 'react';
import { connectToRoom, disconnectFromRoom, appendMessage, appendUser, popUser, disconnectSocket, appendErrorMessage } from '../../../context/actions';

import { userSocket } from '../../userSocket'
import useAppReducer  from '../../../hooks/useAppReducer';

import WindowHeader  from '../../WindowHeader';
import CommandInput  from './CommandInput';
import TerminalLines from './TerminalLines';
import './ChatTerminal.scss';

function ChatTerminal() {

  const inputRef    = useRef(null);
  const terminalRef = useRef(null);
  const {store, dispatch} = useAppReducer();

  useEffect(() => {
    console.log('🥶 Finished whole render')
  })

  useEffect(() => {

    console.log('🐢 Setting all socket listeners');

    // if exist a room id on the path (/room/:id) it joins automatically
    // if (locationParams.room)
    //   CONSOLE_ACTIONS['/join']([locationParams.room])

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
      terminalRef.current.scrollTo({top: terminalRef.current.scrollHeight, behavior: 'smooth'});
    });
    userSocket.on('disconnected-from-room', () => {
      dispatch(disconnectFromRoom());
    });
    userSocket.on('error', ({message}) => {
      dispatch(appendErrorMessage({message}));
      terminalRef.current.scrollTo({top: terminalRef.current.scrollHeight, behavior: 'smooth'});
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
    inputRef.current.focus();
  }, []);

  return (
    <div className='chat-terminal'
      onMouseUp={() => {
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