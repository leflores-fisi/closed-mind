import { useState } from 'react';
import useAppReducer from '../../../../../hooks/useAppReducer';
import EmotePicker from './EmotePicker';
import { emitSocketEvent } from '../../../../userSocket';

function EmoteReactionButton({ message_id, messageReactions }) {

  const [menuOpened, setMenuOpened] = useState(false);
  const {store} = useAppReducer();

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
      emitSocketEvent['new-reaction-to-message']({message_id, emote});
    }
    else {
      if (!reactionInList.users_list.includes(store.user_id))
        emitSocketEvent['reacting-to-message']({message_id, emote});
    }
  }

  return (
    store.room_code &&
    <div className='react-to-message-btn-container'>
      <button className='react-to-message-btn' onClick={handleOpenReactions}>{':)'}</button>
      {
        menuOpened &&
          <EmotePicker onPick={handlePick} setVisibility={setMenuOpened}/>
      }
    </div>
  );
}
export default EmoteReactionButton;