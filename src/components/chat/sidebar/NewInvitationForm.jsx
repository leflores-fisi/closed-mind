import { useRef } from 'react';

function NewInvitationForm({ onSubmit, onCancel }) {

  const textRef = useRef(null);
  
  return (
    <form className='invitation-form' id='create-invitation' onSubmit={(e) => {
      e.preventDefault();
      onSubmit(textRef.current.value);
    }}>
      <textarea className='form-input' ref={textRef}>

      </textarea>
      <div className='form-buttons'>
        <button type='submit' form='create-invitation'>Create</button>
        <button type='button' onClick={() => {
          onCancel();
        }}>Cancel</button>
      </div>
    </form>
  );
}
export default NewInvitationForm;