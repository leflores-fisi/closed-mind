import { useEffect, useState, useRef } from 'react';
import * as actions from '@/context/actions';
import useChatConfig      from '@/hooks/useChatConfig';
import useAppReducer      from '@/hooks/useAppReducer';
import { useForceUpdate } from '@/hooks/useForceUpdate';

import { userSocket } from '@/services/userSocket';
import WindowHeader from '@/components/WindowHeader'

import CommandInput  from './TerminalInput';
import TerminalLines from './TerminalLines';
import TerminalRoomHeader from './statics/TerminalRoomHeader';
import TerminalWelcomeHeader from './statics/TerminalWelcomeHeader';
import { roomNameFromCode, scrollChatIfIsNear, scrollChatToBottom } from '@/Helpers';
import './ChatTerminal.scss';

const APP_TITLE = 'Closedmind | minimalist communication';

function ChatTerminal() {

  const {store, dispatch} = useAppReducer();
  const { messagesCountOnTabHidden } = useChatConfig();
  const [areHeaderSnippetsClosed, setAreHeaderSnippetsClosed] = useState(false);
  const forceUpdate = useForceUpdate();

  const inputRef = useRef(null);

  // For autofocusing the chat input on key down
  useEffect(() => {
    inputRef.current?.focus();
    const focusInput = () => {
      inputRef.current.focus();
    }
    window.addEventListener('keydown', focusInput);
    return () => {
      window.removeEventListener('keydown', focusInput);
    };
  }, [])

  // For reset message count on document title
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        messagesCountOnTabHidden.current = 0;
        document.title = store.room_code ? `${roomNameFromCode(store.room_code)} | Closedmind` : APP_TITLE;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [store.room_code]);

  useEffect(() => {
    scrollChatToBottom();
  }, [store.room_code])

  useEffect(() => {

    // Listeners to <socket.emit(...)>
    userSocket.on('room-created', ({ createdChatRoom }) => {
      dispatch(actions.joinToRoom({chatRoom: createdChatRoom}));
      localStorage.setItem('last_room_code', createdChatRoom.code);
      document.title = `${roomNameFromCode(createdChatRoom.code)} | Closedmind`;
    });
    userSocket.on('joined', ({ joinedChatRoom }) => {
      dispatch(actions.joinToRoom({chatRoom: joinedChatRoom}));
      localStorage.setItem('last_room_code', joinedChatRoom.code);
      document.title = `${roomNameFromCode(joinedChatRoom.code)} | Closedmind`;
    });
    userSocket.on('message-received', ({ date, user, message, message_id }) => {
      dispatch(actions.appendMessage({
        date,
        from: user.user_id,
        color: user.user_color,
        text: message,
        message_id
      }));
      if (document.hidden) {
        document.title = `(${++messagesCountOnTabHidden.current}) ${roomNameFromCode(store.room_code)} | Closedmind`;
      }
    });
    userSocket.on('disconnected-from-room', () => {
      dispatch(actions.disconnectFromRoom());
      document.title = APP_TITLE;
    });
    userSocket.on('message-reacted', ({ message_id, emote, from }) => {
      console.log('REACTION EMITTED FROM SERVER:', emote);
      dispatch(actions.reactToMessage({message_id, emote, from}));

      scrollChatIfIsNear(100);
    });
    userSocket.on('decreased-message-reaction', ({ message_id, emote, from }) => {
      console.log('REACTION DECREASED FROM SERVER:', emote);
      dispatch(actions.decreaseReactionFromMessage({message_id, emote, from}));
    });
    userSocket.on('deleted-message-reaction', ({ message_id, emote, from }) => {
      console.log('REACTION REMOVED FROM SERVER:', emote);
      dispatch(actions.deleteReactionFromMessage({message_id, emote, from}));
    });
    userSocket.on('error', ({ message }) => {
      dispatch(actions.appendErrorMessage({ message }));
    });
    userSocket.on('pong', ({ timestamp, server_log }) => {
      const ping_log = {...server_log, text: server_log.text.concat(`${(Date.now() - timestamp)} ms`)};
      dispatch(actions.appendMessage(ping_log));
    });

    // Listeners to <socket.to(room).emit(...)>
    userSocket.on('user-connected', ({ user, server_log }) => {
      dispatch(actions.appendUser({ user, server_log }));
    });
    userSocket.on('user-disconnected', ({ user_id, server_log }) => {
      dispatch(actions.popUser({ user_id, server_log }));
      document.title = APP_TITLE;
    });

    // socket.io events
    userSocket.on('disconnect', () => {

      if (store.room_code)  {
        console.log('Disconnecting with room code: {room_code:', store.room_code, ', user:', store.user_id,'}');
        dispatch(actions.disconnectFromRoom());
        dispatch(actions.disconnectSocket({}));
      }
      else {
        dispatch(actions.disconnectSocket({}))
        console.log('Disconnecting without room code...');
      }
      document.title = 'Closedmind | minimalist communication';
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
    <div className='chat-terminal'>
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