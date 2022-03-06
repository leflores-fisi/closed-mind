import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userSocket }  from '../userSocket';
import useAppReducer   from '../../hooks/useAppReducer';
import UserForm        from '../welcome/UserForm';
import './InvitationWindow.scss';

function InvitationWindow({ params }) {
  
  const {store} = useAppReducer();
  const [isValid, setIsValid] = useState(false);
  const [fetchedInvitation, setFetchedInvitation] = useState({});

  useEffect(async () => {

    try {
      const url = `http://localhost:8001/invitations/${params.code}`
      const response = await fetch(url);
  
      if (response.status === 200) {
        const invitation = await response.json();
        setIsValid(true);
        console.log('ROOM:', invitation.room_code);
        setFetchedInvitation(invitation);
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
    <div className='invitation-window page'>
      {
        isValid
          ?
            <motion.div
              className='invitation modal-window'
              initial={{y: '90%', opacity: 0}}
              animate={{y: '100%', opacity: 1}}
              transition={{ease: [.24, .72, .74, 1.2]}}
            >
              <header className='title'>
                {fetchedInvitation.host} WANT YOU to join {fetchedInvitation.room_code}
              </header>
              <p className='description'>{fetchedInvitation.description}</p>
              <UserForm onSubmit={() => {
                userSocket.emit('joining-to-chat', {
                  room_id: fetchedInvitation.room_code,
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

export default InvitationWindow;