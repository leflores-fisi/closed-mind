import { useEffect, useState, useRef } from 'react';
import { joinToRoom, disconnectFromRoom, appendMessage,
         appendUser, popUser, disconnectSocket, appendErrorMessage } from '../../../context/actions';

import { userSocket } from '../../userSocket'
import { useForceUpdate } from '../../../hooks/useForceUpdate';
import useAppReducer  from '../../../hooks/useAppReducer';

import WindowHeader  from '../../WindowHeader';
import CommandInput  from './TerminalInput';
import TerminalLines from './TerminalLines';
import TerminalRoomHeader from './TerminalRoomHeader';
import TerminalWelcomeHeader from './TerminalWelcomeHeader';
import './ChatTerminal.scss';

function ChatTerminal() {

  const {store, dispatch} = useAppReducer();
  const [areHeaderSnippetsClosed, setAreHeaderSnippetsClosed] = useState(false);
  const forceUpdate = useForceUpdate();

  const inputRef = useRef(null);

  const handleAutofocus = () => {
    if (window.getSelection().toString() === '')
      inputRef.current?.focus();
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [])

  useEffect(() => {
    const Wrapper = document.querySelector('.command-lines-wrapper');
    const Lines   = document.querySelector('.command-lines');
    Wrapper.scrollTo(0, Lines.getBoundingClientRect().height);
    console.log('scrolling')
  }, [store.room_code])

  useEffect(() => {

    // listeners to <socket.emit(...)>
    userSocket.on('room-created', ({createdChatRoom}) => {
      dispatch(joinToRoom({chatRoom: createdChatRoom}));
      localStorage.setItem('last_room_code', createdChatRoom.code);
    });
    userSocket.on('joined', ({joinedChatRoom}) => {
      dispatch(joinToRoom({chatRoom: joinedChatRoom}));
      localStorage.setItem('last_room_code', joinedChatRoom.code);
    });
    userSocket.on('message-received', ({ date, user, message }) => {
      dispatch(appendMessage({
        date,
        from: user.user_id,
        color: user.user_color,
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
      const ping_log = {...server_log, text: server_log.text.concat(`${(Date.now() - timestamp)} ms`)};
      dispatch(appendMessage(ping_log));
    });

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
      console.log('SOCKET CONNECTION ERROR:', err.message, ', If you see this, you should leave me a message');
      setTimeout(() => {
        userSocket.connect();
      }, 1000);
    });
    
    return () => {
      userSocket.removeAllListeners();
    };

  }, [store.room_code])

  return (
    <div className='chat-terminal' onMouseUp={handleAutofocus}>
      <WindowHeader title='Chat'/>
      {
        store.room_code &&
          <TerminalRoomHeader
            roomCode={store.room_code}
            usersQuantity={store.users.length}
          />
      }
      {
        store.room_code || areHeaderSnippetsClosed
        ?  null
        : <TerminalWelcomeHeader
            input={inputRef}
            forceUpdate={forceUpdate}
            selfClose={setAreHeaderSnippetsClosed}
            lastRoom={store.last_room_code}
          />
      }
      <TerminalLines lines={store.messages}/>
      <CommandInput ref={inputRef}/>
    </div>
  );
}

export default ChatTerminal;