import { useRef, useState } from 'react';
import useAppReducer from '@/hooks/useAppReducer';
import { emitSocketEvent } from '@/services/userSocket';
import { motion, AnimatePresence } from 'framer-motion';
import { SiAddthis } from 'react-icons/si';
import { BsHash } from 'react-icons/bs';

function JoinToRoomForm() {
  
  const [codeToJoin, setCodeToJoin] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const inputRef = useRef(null);
  const { store } = useAppReducer();

  const handleChange = (e) => {
    let code = e.target.value;
    if (code.length === 4) setValidCode(true);
    else setValidCode(false);

    setCodeToJoin(code);
  }
  const toggleForm = () => {
    setIsCreatingRoom(prev => !prev);
  }

  const handleJoiningRoom = (e) => {
    e.preventDefault();
    emitSocketEvent['joining-to-chat']({
      room_code: codeToJoin,
      user: {
        user_id: store.user_id,
        user_color: store.user_color
      }
    })
  }
  
  return (
    <div className='join-to-room-container'>
      <button className={`toggle-btn ${isCreatingRoom ? 'opened' : ''}`}
        onClick={toggleForm}
      >
        <div className='icon'>
          <SiAddthis/>
        </div>
        <div className='content'>
          <div className='title'>Join to a room</div>
          <div className='description'>Enroll with cool people</div>
        </div>
      </button>
      <AnimatePresence>
        {
          isCreatingRoom &&
          <motion.form
            id='join-to-room'
            onSubmit={handleJoiningRoom}
            initial={{height: 0}}
            animate={{height: 'auto'}}
            exit={{height: 0}}
          >
            <div className='input-container'>
              <BsHash/>
              <input
                value={codeToJoin}
                placeholder='Enter the room code'
                ref={inputRef}
                type='text'
                onChange={handleChange}
              />
            </div>
            <button type='submit' form='join-to-room' disabled={!validCode}>Join</button>
          </motion.form>
        }
      </AnimatePresence>
    </div>
  );
}
export default JoinToRoomForm;
