import { useState, useRef } from 'react';


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
      className='emotes-wrapper'
      ref={wrapperRef}
    >
      <div className='emotes'>
        {
          emotes.map(emote => (
            <button
              type='button'
              key={emote}
              className={`color bg-${emote} ${selectedEmote === emote ? 'selected' : ''}`}
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