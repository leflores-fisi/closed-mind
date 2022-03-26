import { useState } from 'react';
import useAppReducer from '../../../../hooks/useAppReducer';
import useOverlay from '../../../../hooks/useOverlay';
import EmotePicker from '../../../overlay/EmotePicker';
import { emitSocketEvent } from '../../../userSocket';

function EmoteReactionButton({ message_id }) {

  const [menuOpened, setMenuOpened] = useState(false);

  const handleOpenReactions = () => {
    // setEmotePickerCoords({x: e.clientX, y: e.clientY});
    // setOnEmotePickCallback({
    //   exec: (emote) => {
    //   console.log('EMITTING TO SERVER', emote, message_id)
    //   }
    // })
    setMenuOpened(true);
  }
  const handlePick = (emote) => {
    console.log(`(@From button) REACTION TO ${message_id} WITH`, emote);
    emitSocketEvent['new-reaction-to-message']({message_id, emote});
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