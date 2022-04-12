import { useEffect, useState } from 'react';
import { userSocket } from '@/services/userSocket';
import useAppReducer  from '@/hooks/useAppReducer';
import { CLOUD_API_URL } from '@/services/userSocket';
import { emitSocketEvent } from '@/services/userSocket';

import UserMessage from './UserMessage';
import { scrollChatToBottom } from '@/Helpers';

import MessageAttachments   from '../chat-interactive/MessageAttachments';
import EmoteReactionButton  from './message_actions/emotes/EmoteReactionButton';
import MessageReactionsList from './message_actions/emotes/MessageReactionsList';
import ReplyMessageButton   from './message_actions/replies/ReplyMessageButton';
import axios from 'axios';

function SelMessageLine({ text, date, id, reactions, replyingTo, filesToSubmit }) {

  const [isHovered, setIsHovered] = useState(false);
  const [fetchedAttachments, setFetchedAttachments] = useState([]);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [filesLoaded, setFilesLoaded] = useState(false);
  const [sent, setSent] = useState(false);
  const {store} = useAppReducer();

  useEffect(() => {
    setTimeout(scrollChatToBottom, 0)

    if (!sent && store.room_code) {
      userSocket.on('message-sent', () => {
        setSent(true);
        userSocket.removeListener('message-sent')
      })
    }
    else setSent(true);
  }, [])

  useEffect(() => {
    if (filesToSubmit && filesToSubmit.length > 0) {

      const formData = new FormData();
  
      filesToSubmit.forEach(file => {
        let fileName = file.name.replace(/(\.\w+)$/, '').replaceAll(' ', '-');
        console.log('Submitting:', file);
        formData.append(fileName, file);
      })
      console.log('Posting with', formData);
      axios.post(`${CLOUD_API_URL}/attachments`, formData, {
        headers: { 'Content-type': 'multipart/form-data' },
        onUploadProgress(e) {
          setSubmitProgress((e.loaded/e.total)*100);
          console.log(`${(e.loaded/e.total)*100}%`, e)
        }
      }).then(response => {
        const attachmentsListInfo = response.data;
        console.log('RECEIVED RESPONSE FROM POST', attachmentsListInfo);
        filesToSubmit.forEach(file => {
          if (file.blobSrc) URL.revokeObjectURL(file.blobSrc)
        });

        emitSocketEvent['sending-message']({
          date: date,
          message: text,
          message_id: id,
          replyingTo: replyingTo,
          attachments: attachmentsListInfo
        })
        setFetchedAttachments(attachmentsListInfo);
        setTimeout(() => setFilesLoaded(true), 500)
      })
    }
  }, [])

  return (
    <div className={`user-message self ${sent? 'sent' : ''}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className='message-container'>
        <UserMessage date={date} userId={store.user_id} userColor={store.user_color} text={text} messageReplying={replyingTo}/>
        {
          isHovered &&
          <div className='message-actions'>
            <EmoteReactionButton message_id={id} messageReactions={reactions}/>
            <ReplyMessageButton from={store.user_id} color={store.user_color} text={text}/>
          </div>
        }
      </div>
      {
        fetchedAttachments.length > 0 ?
          <MessageAttachments attachments={fetchedAttachments}/> :
        filesToSubmit.length > 0 ?
          <MessageAttachments attachments={filesToSubmit}/> : null
      }
      <MessageReactionsList message_id={id} reactions={reactions}/>
      {
        !filesLoaded ?
        <div className='attachments-progress-bar'>
          <span className='progress' style={{width: `${submitProgress}%`}}></span>
        </div> : null
      }
    </div>
  )
}

export default SelMessageLine;