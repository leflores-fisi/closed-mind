import { useState, useRef } from 'react';
import { API_URL } from '@/services/userSocket';
import useAppReducer from '@/hooks/useAppReducer';

function NewInvitationForm({ onSubmit, onCancel }) {

  const textRef  = useRef(null);
  const {store} = useAppReducer();
  const [wannaSetRoomPrivate, setWannaSetRoomPrivate] = useState(true);

  return (
    <form className='invitation-form' id='create-invitation' onSubmit={(e) => {
      e.preventDefault();
      onSubmit(textRef.current.value);
      fetch(`${API_URL}/rooms/${store.room_code}/edit-config`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          privacy: wannaSetRoomPrivate ? 'private' : 'public'
        })
      })
    }}>
      <textarea className='invitation-message-input' placeholder='Wanna say something?' ref={textRef}/>
      {
        store.privacy === 'public' &&
        <div className='room-privacy-check'>
          <input type='checkbox' checked={wannaSetRoomPrivate} onChange={() => {
            setWannaSetRoomPrivate(prev => !prev)
          }}/>
          <div>Make room private</div>
        </div>
      }
      <div className='form-buttons'>
        <button type='submit' form='create-invitation'>Create</button>
        <button type='button' onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
export default NewInvitationForm;