import { useState, useRef } from 'react';
import './EmotePicker.scss';

function EmotePicker({ onPick, setVisibility }) {

  const wrapperRef = useRef(null);
  
  const emotes = ['👍', '💗', '🤣', '😔', '😡', '🌾'];
  const [selectedEmote, setSelectedEmote] = useState(null);

  const hidePicker = (e) => {
    setVisibility(false);
  }

  return (
    <div
      // TODO: add role
      className='emotes-to-react-list'
      ref={wrapperRef}
    >
      <div className='emotes-container'>
        {
          emotes.map(emote => (
            <button
              type='button'
              key={emote}
              className={`bg-${emote} ${selectedEmote === emote ? 'selected' : ''}`}
              onClick={() => {
                setSelectedEmote(emote);
                onPick(emote);
                hidePicker();
              }}>
              {emote}
            </button>
          ))
        }
      </div>
    </div>
  );
}
export default EmotePicker;