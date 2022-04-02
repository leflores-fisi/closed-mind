import { useState } from 'react';
import { emitSocketEvent } from '@/services/userSocket';
import { reactToMessage } from '@/context/actions';
import useAppReducer from '@/hooks/useAppReducer';
import EmotePicker from './EmotePicker';
import { MdOutlineAddReaction } from 'react-icons/md'
import { scrollChatIfIsNear } from '@/Helpers';

function EmoteReactionButton({ message_id, messageReactions }) {

  const [menuOpened, setMenuOpened] = useState(false);
  const { store, dispatch } = useAppReducer();

  const hideMenu = () => {
    let Overlay = document.querySelector('.app-overlay');
    setMenuOpened(false);
    Overlay.style.pointerEvents = 'none';
    Overlay.removeEventListener('click', hideMenu);
  }

  const handleOpenReactions = () => {
    let Overlay = document.querySelector('.app-overlay');
    setMenuOpened(true);
    Overlay.style.pointerEvents = 'auto';
    Overlay.addEventListener('click', hideMenu);
  }
  const handlePick = (emote) => {
    document.querySelector('.app-overlay').style.pointerEvents = 'none';
    console.log(`(@From button) REACTION TO ${message_id} WITH`, emote);

    const reactionInList = messageReactions.find(reaction => reaction.emote === emote);

    if (!reactionInList) {
      emitSocketEvent['new-reaction-to-message']({ message_id, emote });
      dispatch(reactToMessage({ message_id, emote, from: store.user_id }));
      scrollChatIfIsNear(100);
    }
    else {
      if (!reactionInList.users_list.includes(store.user_id))  {
        emitSocketEvent['reacting-to-message']({ message_id, emote });
        dispatch(reactToMessage({ message_id, emote, from: store.user_id }));
      }
    }
  }

  return (
    store.room_code &&
    <div className='message-action react-to-message-btn-container'>
      <button className='react-to-message-btn' onClick={handleOpenReactions}>
        <MdOutlineAddReaction/>
      </button>
      {
        menuOpened &&
          <EmotePicker onPick={handlePick} setVisibility={setMenuOpened}/>
      }
    </div>
  );
}
export default EmoteReactionButton;