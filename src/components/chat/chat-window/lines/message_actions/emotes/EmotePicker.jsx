import { useState, useRef } from 'react';
import { emotes_list } from './emotes';

import './EmotePicker.scss';

function EmotePicker({ onPick, setVisibility }) {

  const wrapperRef = useRef(null);

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
          emotes_list.map((emote) => (
            <li key={emote.text}>
              <button
                type='button'
                className={`emote-${emote} ${selectedEmote?.text === emote.text ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedEmote(emote);
                  onPick(emote.text);
                  hidePicker();
                }}>
                  <img src={emote.src}/>
              </button>
            </li>
          ))
        }
      </ul>
    </div>
  );
}
export default EmotePicker;