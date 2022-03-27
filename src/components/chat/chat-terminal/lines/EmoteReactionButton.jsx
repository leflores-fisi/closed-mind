import { useState } from 'react';
import useAppReducer from '../../../../hooks/useAppReducer';
import EmotePicker from './EmotePicker';
import { emitSocketEvent } from '../../../userSocket';

function EmoteReactionButton({ message_id, messageReactions }) {

  const [menuOpened, setMenuOpened] = useState(false);
  const {store} = useAppReducer();

  const handleOpenReactions = () => {
    setMenuOpened(true);
  }
  const handlePick = (emote) => {
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
    <div className='react-to-message-container'>
      <button className='react-to-message-button' onClick={handleOpenReactions}>{':)'}</button>
      {
        menuOpened &&
          <EmotePicker onPick={handlePick} closer={setMenuOpened}/>
      }
    </div>
  );
}
export default EmoteReactionButton;