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
      <ul className='emotes-container'>
        {
          emotes.map((emote, i) => (
            <li key={emote}>
              <button
                type='button'
                className={`bg-${emote} ${selectedEmote === emote ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedEmote(emote);
                  onPick(emote);
                  hidePicker();
                }}>
                {emote}
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  );
}
export default EmotePicker;