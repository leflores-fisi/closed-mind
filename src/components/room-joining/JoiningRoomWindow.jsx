import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userSocket }  from '../userSocket'
import useAppReducer   from '../../hooks/useAppReducer';
import UserForm        from '../welcome/UserForm';
import './JoiningRoomWindow.scss';

function JoiningRoomWindow({ params }) {
  
  const {store} = useAppReducer();
  const [isValid, setIsValid] = useState(false);
  const [fetchedRoom, setFetchedRoom] = useState({});

  useEffect(async () => {

    try {
      const url = `http://localhost:8001/sessions/${params.room}`
      const response = await fetch(url);
  
      if (response.status === 200) {
        const room = await response.json();
        setIsValid(true);
        console.log('ROOM:', room);
        setFetchedRoom(room);
      }
      else if (response.status === 404) {
        console.log('ROOM NOT FOUNDED')
      }
    }
    catch (error) {
      console.log('Fetch error (InvitationWindow):', error);
    }
  }, [])

  return (
    <div className='joining-room-window page'>
      {
        isValid
          ?
            <motion.div
              className='lobby modal-window'
              initial={{
                y: '90%',
                opacity: 0
              }}
              animate={{
                y: '100%',
                opacity: 1
              }}
              transition={{
                ease: [.24, .72, .74, 1.2]
              }}
            >
              <div className='text'>
                You are about to join {fetchedRoom.code}
              </div>
              <UserForm onSubmit={() => {
                userSocket.emit('joining-to-chat', {
                  room_id: fetchedRoom.code,
                  user_id: store.user_id
                });
              }}/>
            </motion.div>
          :
          null
      }
    </div>
  );
}

export default JoiningRoomWindow;