import unable_to_load_img from '@/assets/app-messages/unable-to-load.jpg';
import { formatBytes } from '@/Helpers';
import { memo } from 'react';

import { AiFillFile }            from 'react-icons/ai';
import { MdOutlineFileDownload } from 'react-icons/md';
import ImageAttachment from './ImageAttachment';
import VideoAttachment from './VideoAttachment';

function MessageAttachments({ attachments }) {
  
  return (
    <div className='message-attachments'>
      {
        attachments.map((attachment, i) => (
          <div className='attachment-container' role='button' key={i}>
            {
              attachment.type.includes('image')
              ? <ImageAttachment src={attachment.url || attachment.blobSrc} name={attachment.name}/> :

              attachment.type.includes('video')
              ? <VideoAttachment src={attachment.url || attachment.blobSrc} type={attachment.type} name={attachment.name}/>

              : <div className='other-file-viewer'>
                  <div className='file-icon-container'>
                    <div className='file-icon'>
                      <AiFillFile size={50}/>
                    </div>
                    <div className='file-format'>
                      {attachment.format || attachment.type}
                    </div>
                  </div>
                  <div className='content-information'>
                    <div className='file-name'><a href={attachment.url} target='_blank' download={attachment.name}>{attachment.name}</a></div>
                    <div className='file-size'>{formatBytes(attachment.size)}</div>
                  </div>
                  <div className='download-file'>
                    <a href={attachment.url} target='_blank'>
                      <MdOutlineFileDownload size={30}/>
                    </a>
                  </div>
                </div>
            }
          </div>
        ))
      }
    </div>
  );
}
export default MessageAttachments;
