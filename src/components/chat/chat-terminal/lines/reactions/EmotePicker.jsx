import { useState, useRef } from 'react';
//import sad from '@/assets/emotes/sad.png'
//import angry from '@/assets/emotes/angry.gif'

import './EmotePicker.scss';

function EmotePicker({ onPick, setVisibility }) {

  const wrapperRef = useRef(null);

  const emotes = ['check', 'heart', 'laugh', 'sad', 'angry', 'hello', 'doge'];
  const [selectedEmote, setSelectedEmote] = useState(null);

  const hidePicker = (e) => {
    setVisibility(false);
    //console.log(sad)
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
                className={`emote-${emote} ${selectedEmote === emote ? 'selected' : ''}`}
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