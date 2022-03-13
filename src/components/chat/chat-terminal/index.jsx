import { useEffect, useRef } from 'react';
import { connectToRoom, disconnectFromRoom, appendMessage,
         appendUser, popUser, disconnectSocket, appendErrorMessage } from '../../../context/actions';

import { userSocket } from '../../userSocket'
import useAppReducer  from '../../../hooks/useAppReducer';

import WindowHeader  from '../../WindowHeader';
import CommandInput  from './TerminalInput';
import TerminalLines from './TerminalLines';
import ChatOptions   from './ChatOptions';
import './ChatTerminal.scss';

function ChatTerminal() {

  const {store, dispatch} = useAppReducer();

  const inputRef = useRef(null);

  const handleAutofocus = () => {
    if (window.getSelection().toString() === '')
      inputRef.current.focus()
  }

  useEffect(() => {
    console.log('🥶 Finished whole render');
    inputRef.current.focus();
  }, [])

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
    });
    userSocket.on('message-received', ({ date, user_id, user_color, message }) => {
      dispatch(appendMessage({
        date,
        from: user_id,
        color: user_color,
        text: message
      }));
    });
    userSocket.on('disconnected-from-room', () => {
      dispatch(disconnectFromRoom());
    });
    userSocket.on('error', ({ message }) => {
      dispatch(appendErrorMessage({ message }));
    });
    userSocket.on('pong', ({timestamp, server_log}) => {
      const ping_log = {...server_log, text: server_log.text.concat(`${(Date.now() - timestamp)} ms`)}
      dispatch(appendMessage(ping_log))
    })

    // listeners to <socket.to(room).emit(...)>
    userSocket.on('user-connected', ({user, server_log}) => {
      dispatch(appendUser({ user, server_log }));
    });
    userSocket.on('user-disconnected', ({user_id, server_log}) => {
      dispatch(popUser({ user_id, server_log }));
    });

    // socket.io events
    userSocket.on('disconnect', () => {

      if (store.room_code)  {
        console.log('Disconnecting with room code: {room_code:', store.room_code, ', user:', store.user_id,'}');
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

  }, [store.room_code])

  return (
    <div className='chat-terminal' onMouseUp={handleAutofocus}>
      <WindowHeader title='Chat' side={<ChatOptions/>}/>
      <TerminalLines lines={store.messages}/>
      <CommandInput ref={inputRef}/>
    </div>
  );
}

export default ChatTerminal;