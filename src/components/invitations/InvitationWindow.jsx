import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { userSocket }  from '../userSocket';
import useAppReducer   from '../../hooks/useAppReducer';
import UserForm        from '../welcome/UserForm';
import './InvitationWindow.scss';

function InvitationWindow({ params }) {
  
  const {store} = useAppReducer();
  const [location, setLocation] = useLocation();
  const [fetchedInvitation, setFetchedInvitation] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = () => {
    userSocket.emit('joining-to-chat', {
      room_code: fetchedInvitation.room_code,
      user: {
        user_id: store.user_id,
        user_color: store.user_color
      },
      from_invitation: true
    });
    setLocation('/');
  }

  useEffect(async () => {
    try {
      const url = `http://localhost:8001/invitations/${params.code}`
      const response = await fetch(url);
      setIsLoading(false);
  
      if (response.status === 200) {
        const invitation = await response.json();
        console.log('ROOM:', invitation.room_code);
        setIsValid(true);
        setFetchedInvitation(invitation);
      }
      else if (response.status === 404) {
        console.log('ROOM NOT FOUNDED');
        setIsValid(false);
      }
    }
    catch (error) {
      console.log('Fetch error (InvitationWindow):', error);
    }
  }, [])

  return (
    <div className='invitation-window page'>
      {
        isLoading
          ? null
          : <motion.div
              className='invitation modal-window'
              initial={{y: '-20px', opacity: 0}}
              animate={{y: '0', opacity: 1}}
              transition={{ease: [0.24, 0.72, 0.74, 1.2]}}
            >
              {
                isValid
                  ? < >
                      <header className='title'>
                        {fetchedInvitation.host} WANT YOU to join {fetchedInvitation.room_code}
                      </header>

                      <p className='description'>{fetchedInvitation.description}</p>
                      <UserForm onSuccessfullySubmit={handleSubmit}/>
                    </>
                  : < >
                      <div className='title'>This invitation doesn't exist!</div>
                      <div className='description'>
                        <div>Maybe it was deleted</div>
                        <div>Maybe it never existed</div>
                        <div><i>Or maybe is our fault</i></div><br/>
                        <div>No one knows at this point</div>
                      </div>
                      <div className='default'>〰closed mind〰</div> 
                    </>
              }
            </motion.div>
      }
    </div>
  );
}

export default InvitationWindow;