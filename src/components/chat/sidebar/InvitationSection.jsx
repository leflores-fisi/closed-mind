import { useRef, useState } from 'react';
import useAppReducer from '../../../hooks/useAppReducer';
import NewInvitationForm from './NewInvitationForm';
import { apiURL } from '../../userSocket';
import './InvitationSection.scss';

function InvitationLink() {

  const {store} = useAppReducer();
  const inputRef = useRef();
  const [isCopied, setIsCopied] = useState(false);
  const [creatingInvitation, setCreatingInvitation] = useState(false);
  const [fetchedInvitation, setFetchedInvitation] = useState(undefined);
  
  const handleCopy = () => {
    inputRef.current.select();
    if (!isCopied) {
      document.execCommand('copy');
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }
  const handleFocus = () => {
    inputRef.current.select();
  }
  const generateInvitation = async (invitation_description) => {
    try {
      let url = `${apiURL}/invitations`
      const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          room_code: store.room_code,
          host: store.user_id,
          description: invitation_description
        })
      })
      const invitation = await response.json();
      setFetchedInvitation(invitation);
      setCreatingInvitation(false);
    }
    catch (error) {
      console.log('Fetching ERROR: InvitationLink:', error);
    }
  }
  const deleteInvitation = async () => {
    let url = `${apiURL}/invitations/${fetchedInvitation.invitation_code}`
    const response = await fetch(url, {
      method: 'DELETE',
    });
    setFetchedInvitation(null);
    setCreatingInvitation(false);
  }
  const cancelForm = () => {
    setCreatingInvitation(false);
  }

  return (
    <section className='sidebar-invitation'>
      {
        creatingInvitation && !fetchedInvitation ?
          <NewInvitationForm onSubmit={generateInvitation} onCancel={cancelForm}/>
        :
        fetchedInvitation ?
          <section className='created-invitation'>
            <div className={`invitation ${isCopied ? 'copied' : ''}`}>
              <input
                className='link'
                ref={inputRef}
                onFocus={handleFocus}
                onChange={() => {}}
                value={`https://closedmind.vercel.app/invite/${fetchedInvitation.invitation_code}`}
              />
              <button className='copy-btn' onClick={handleCopy}>{isCopied ? 'Yes!' : 'Copy'}</button>
            </div>
            <p>
              <span>This link expires on 7 days. </span>
              <button className='delete-invitation-btn' onClick={deleteInvitation}>Delete now.</button>
            </p>
          </section>
        :
          <section className='no-invitation-section'>
            <header>
              <h3 className='title'>Invite people</h3>
              <p className='subtitle'>This is better with friends!</p>
            </header>
            <button className='generate-invitation-btn' onClick={() => {setCreatingInvitation(true)}}>Generate invitation link</button>
          </section>
      }
    </section>
  )
}

export default InvitationLink;