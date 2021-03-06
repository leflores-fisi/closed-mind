import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

import { emitSocketEvent, API_URL } from '@/services/userSocket';
import UserForm from '@/components/welcome/UserForm';

import closedmind_sad_logo from '@/assets/logos/closedmind-sad.png';
import ClosedmindHeader from '../ClosedmindHeader';
import './InvitationPage.scss';

function InvitationPage({ params }) {
  
  const [location, setLocation] = useLocation();
  const [fetchedInvitation, setFetchedInvitation] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = ({userId, userColor}) => {
    emitSocketEvent['joining-to-chat']({
      room_code: fetchedInvitation.room_code,
      user: {
        user_id: userId,
        user_color: userColor
      },
      fromPublicList: false
    });
    setLocation('/');
  };

  // Fetching invitation on the API
  useEffect(async () => {
    try {
      const url = `${API_URL}/invitations/${params.code}`
      const response = await fetch(url);
      setIsLoading(false);
  
      if (response.status === 200) {
        const invitation = await response.json();
        console.log('ROOM:', invitation.room_code);
        setFetchedInvitation(invitation);
        setIsValid(true);
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
      <div className='wrapper'>
        <ClosedmindHeader description={true}/>
        <div className='container'>
          <div className='box-wrapper'>
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
                        ? <div className='wrapper'>
                            <header className='invitation-header'>
                              <div className='subtitle'>You were invited to join</div>
                              <div className='room-code'>{fetchedInvitation.room_name}</div>
                            </header>

                            <div className='description'>
                              <div className='text-content'>
                                {fetchedInvitation.description}
                              </div>
                            </div>
                            <UserForm onSuccessfullySubmit={handleSubmit}/>
                          </div>
                        : <div className='wrapper'>
                            <picture className='sad-logo'>
                              <img src={closedmind_sad_logo}/>
                            </picture>
                            <div className='invitation-header'>
                              This invitation doesn't exist!
                            </div>
                            <div className='description'>
                              <div className='text-content'>
                                <div>Maybe it was deleted</div>
                                <div>Maybe it never existed</div>
                                <div><i>Or maybe is our fault</i></div><br/>
                                <div>No one knows at this point</div>
                              </div>
                            </div>
                          </div>
                    }
                  </motion.div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvitationPage;
