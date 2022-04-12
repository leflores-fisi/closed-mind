import { useEffect, useRef, useState } from 'react';
import { emitSocketEvent } from '@/services/userSocket';
import useAppReducer from '@/hooks/useAppReducer';
import { AnimatePresence, motion } from 'framer-motion';
import { SiAddthis } from 'react-icons/si';

function CreateRoomForm() {

  const [roomNameToCreate, setRoomNameToCreate] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [joiningError, setJoiningError] = useState('');
  const [validCode, setValidCode] = useState(false);
  const inputRef = useRef(null);
  const { store } = useAppReducer();

  const handleChange = (e) => {
    let nameInput = e.target.value;
    if (joiningError) setJoiningError('');
    if (nameInput.length > 1) setValidCode(true);
    else setValidCode(false);
    
    setRoomNameToCreate(e.target.value);
  }
  useEffect(() => {
    console.log(inputRef)
    if (inputRef.current) {
      if (isCreatingRoom) inputRef.current.focus();
      else inputRef.current.blur();
    }
  }, [isCreatingRoom])

  const toggleForm = () => {
    setIsCreatingRoom(prev => !prev);
  }

  const handleCreatingRoom = (e) => {
    e.preventDefault();
    if (roomNameToCreate) {
      emitSocketEvent['creating-chat-room']({
        room_name: roomNameToCreate,
        host: {
          user_id: store.user_id,
          user_color: store.user_color
        }
      });
    }
    else {
      setJoiningError('And your room name is...?');
    }
  }
  
  return (
    <div className='create-room-container'>
      <button className={`toggle-btn ${isCreatingRoom ? 'opened' : ''}`}
        onClick={toggleForm}
      >
        <div className='icon'>
          <SiAddthis/>
        </div>
        <div className='content'>
          <div className='title'>Create a room</div>
          <div className='description'>Start interesting stuff</div>
        </div>
      </button>
      <AnimatePresence>
        {
          isCreatingRoom &&
          <motion.form
            id='create-room'
            onSubmit={handleCreatingRoom}
            initial={{height: 0}}
            animate={{height: 'auto'}}
            exit={{height: 0}}
          >
            <div className='input-container'>
              <input
                value={roomNameToCreate}
                placeholder='Enter a memorable name'
                ref={inputRef}
                type='text'
                onChange={handleChange}
              />
            </div>
            { joiningError && <div className='red'>{joiningError}</div> }
            <button type='submit' form='create-room' disabled={!validCode}>Create</button>
          </motion.form>
        }
      </AnimatePresence>
    </div>
  );
}
export default CreateRoomForm;
