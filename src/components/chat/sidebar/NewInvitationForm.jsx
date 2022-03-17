import { useState, useRef } from 'react';
import { apiURL } from '../../userSocket';
import useAppReducer from './../../../hooks/useAppReducer';

function NewInvitationForm({ onSubmit, onCancel }) {

  const textRef  = useRef(null);
  const {store} = useAppReducer();
  const [isInvitationsOnly, setIsInvitationsOnly] = useState(true);

  return (
    <form className='invitation-form' id='create-invitation' onSubmit={(e) => {
      e.preventDefault();
      onSubmit(textRef.current.value);
      fetch(`${apiURL}/rooms/${store.room_code}/edit-config`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          invitations_only: isInvitationsOnly
        })
      })
    }}>
      <textarea className='invitation-message-input' placeholder='Wanna say something?' ref={textRef}/>
      <div className='only-invitations-check'>
        <input type='checkbox' checked={isInvitationsOnly} onChange={() => {
          setIsInvitationsOnly(prev => !prev)
        }}/>
        <div>Make invitations only</div>
      </div>
      <div className='form-buttons'>
        <button type='submit' form='create-invitation'>Create</button>
        <button type='button' onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
export default NewInvitationForm;