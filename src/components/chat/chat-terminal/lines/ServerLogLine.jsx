import { useEffect } from 'react';
import { scrollChatIfIsNear } from '@/Helpers';
import useChatConfig from '@/hooks/useChatConfig';
import useDateFormatter from '@/hooks/useDateFormatter';
import EmoteReactionButton from './message_actions/emotes/EmoteReactionButton';
import MessageReactionsList from './message_actions/emotes/MessageReactionsList';

function ServerLogLine({date, log, id, reactions}) {
  
  const {serverLogVisible} = useChatConfig();
  const formattedDate = useDateFormatter(date);

  useEffect(() => {
    scrollChatIfIsNear();
  }, [])
  
  return (
    serverLogVisible &&
      <div className='server-log'>
        <div className='message-container'>
          <div className='content-wrapper'>
            <time className='date'>{formattedDate}</time>
            <span className='from'>{'[Server]:'}</span>
            <span className='text'>{log}</span>
          </div>
          <EmoteReactionButton message_id={id} messageReactions={reactions}/>
        </div>
        <MessageReactionsList message_id={id} reactions={reactions}/>
      </div>
)
}

export default ServerLogLine