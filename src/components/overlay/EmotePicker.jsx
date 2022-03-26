import { useState, useEffect, useRef } from 'react';
import { isEmptyObject } from '../../Helpers';



function EmotePicker({ direction = 'up', onPick, closer }) {

  const wrapperRef = useRef(null);
  
  const emotes = ['👍', '💗', '🤣', '😔', '😡'];
  const [selectedEmote, setSelectedEmote] = useState(null);

  const showPicker = () => {
  //   let Picker = document.querySelector('.app-overlay .emote-picker');

  //   const {
  //     height: pickerHeight,
  //     width:  pickerWidth
  //   } = wrapperRef.current.getBoundingClientRect();
  //   const {
  //     x: pickerX,
  //     y: pickerY
  //   } = emotePickerCoords;

  //   const {
  //     width: titleWidth
  //   } = Picker.getBoundingClientRect();

  //   let isOverflowing = pickerX + (titleWidth/2) + 5 > document.body.clientWidth;

  //   Picker.style.left = (
  //     isOverflowing ? `${document.body.clientWidth - titleWidth - 5}px`
  //                   : `${pickerX - (titleWidth/2) + (pickerWidth/2)}px`
  //   )
  //   Picker.style.top  = (
  //     direction === 'up'   ? `${pickerY - pickerHeight - 5}px` :
  //     direction === 'down' ? `${pickerY + pickerHeight + 15}px`
  //     : ''
  //   )
  //   Picker.classList.add('showing');
    window.addEventListener('click', hidePicker);
  }
  useEffect(() => {
    //if (!isEmptyObject(emotePickerCoords)) showPicker();
  }, [])

  const hidePicker = (e) => {
    closer(false);
    // if (e) {
    //   console.log(e.target, e.target.classList[0])
    //   if (e.target.classList[0] === 'emotes') {
    //     return;
    //   }
    // }
    // const Picker = document.querySelector('.app-overlay .emote-picker');
    // window.removeEventListener('click', hidePicker);
    // Picker.classList.remove('showing');
  }

  return (
    <div
      // role={'dialog'}
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