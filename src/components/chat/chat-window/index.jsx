import { useEffect, useState, useRef } from 'react';
import * as actions from '@/context/actions';
import useChatConfig      from '@/hooks/useChatConfig';
import useAppReducer      from '@/hooks/useAppReducer';
import { useForceUpdate } from '@/hooks/useForceUpdate';

import { userSocket } from '@/services/userSocket';
import { notificationSound } from '@/services/sounds';
import ChatLobbyUI  from '@/components/chat/lobby/ChatLobbyUI';
import WindowHeader from '@/components/WindowHeader';
import { saveRoomToHistory, scrollChatIfIsNear, waitForSeconds } from '@/Helpers';

import ChatMessageInput from './ChatMessageInput';
import ChatMessageLines from './ChatMessageLines';
import ChatRoomHeader from './statics/ChatRoomHeader';
import { ChatInputContextProvider } from '@/context/chatInputContext';
import EnteringChatHeader from './statics/EnteringChatHeader';
import './ChatWindow.scss';

const APP_TITLE = 'Closedmind | minimalist communication';

const waiterEnded = waitForSeconds(1);

function ChatWindow() {

  const {store, dispatch} = useAppReducer();
  const { messagesCountOnTabHidden } = useChatConfig();
  const [areHeaderSnippetsClosed, setAreHeaderSnippetsClosed] = useState(false);
  const forceUpdate = useForceUpdate();

  const inputRef = useRef(null);

  // For autofocusing the chat input on key down
  useEffect(() => {
    inputRef.current?.focus();
    const focusInput = (e) => {
      if (!inputRef.current) return;
      let doing_command = e.key.match(/(control|shift|alt)/i);
      let pasting_text = e.ctrlKey && e.key.toLowerCase() === 'v';
      let copying_text = e.ctrlKey && e.key.toLowerCase() === 'c';
      let focused_other_input = document.activeElement.classList[0] === 'invitation-message-input';

      if (!focused_other_input && (!doing_command || pasting_text) && !copying_text) {
        inputRef.current.focus();
      }
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
        document.title = store.room_code ? `${store.room_name} | Closedmind` : APP_TITLE;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [store.room_code]);

  useEffect(() => {
    //scrollChatToBottom();
  }, [store.room_code])

  useEffect(() => {

    // Listeners to <socket.emit(...)>
    userSocket.on('room-created', ({ createdChatRoom }) => {
      dispatch(actions.joinToRoom({chatRoom: createdChatRoom}));
      saveRoomToHistory(createdChatRoom.name, createdChatRoom.code, store.user_id, store.user_color);
      document.title = `${createdChatRoom.name} | Closedmind`;
    });
    userSocket.on('joined', ({ joinedChatRoom }) => {
      dispatch(actions.joinToRoom({chatRoom: joinedChatRoom}));
      saveRoomToHistory(joinedChatRoom.name, joinedChatRoom.code, store.user_id, store.user_color);
      document.title = `${joinedChatRoom.name} | Closedmind`;
    });
    userSocket.on('message-received', ({ date, user, message, message_id, replyingTo, attachments }) => {
      if (waiterEnded.next().value) {
        notificationSound.play();
      }
      if (document.hidden) {
        document.title = `(${++messagesCountOnTabHidden.current}) ${store.room_name} | Closedmind`;
      }
      dispatch(actions.appendMessage({
        date,
        from: user.user_id,
        color: user.user_color,
        text: message,
        message_id,
        replyingTo,
        attachments
      }));
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
        console.log('Disconnecting with: {room_code:', store.room_code, ', user:', store.user_id,'}');
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
    <ChatInputContextProvider>
      <div className='chat-window'>
        <WindowHeader title='Chat'/>
        {
          store.room_code
          ? < >
              <ChatRoomHeader
                roomName={store.room_name}
                usersQuantity={store.users.length}
              />
              <ChatMessageLines lines={store.messages}/>
              <ChatMessageInput ref={inputRef}/>
            </>
          : < >
              <EnteringChatHeader/>
              <ChatLobbyUI/>
            </>
        }
      </div>
    </ChatInputContextProvider>
  );
}

export default ChatWindow;
