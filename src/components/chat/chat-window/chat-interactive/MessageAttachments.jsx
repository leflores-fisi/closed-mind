import { AiFillFile } from 'react-icons/ai';
import { MdOutlineFileDownload } from 'react-icons/md';
import unable_to_load_img from '@/assets/app-messages/unable-to-load.jpg';
import { formatBytes } from '@/Helpers';

function MessageAttachments({ attachments }) {
  
  return (
    attachments.length > 0 &&
    <div className='message-attachments'>
      {
        attachments.map((attachment, i) => (
          <div className='attachment-container' role='button' key={i}>
            {
              attachment.type.includes('image')
              ? <img
                  src={attachment.url}
                  alt={attachment.fileName || 'image'}
                  loading='lazy'
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = unable_to_load_img;
                  }}
                /> :

              attachment.type.includes('video')
              ? <video controls>
                  <source src={attachment.url} type={attachment.type || 'video/mp4'}/>
                </video>

              : <div className='other-file-viewer'>
                  <div className='file-icon-container'>
                    <div className='file-icon'>
                      <AiFillFile size={50}/>
                    </div>
                    <div className='file-format'>
                      {attachment.format}
                    </div>
                  </div>
                  <div className='content-information'>
                    <div className='file-name'>{attachment.fileName}</div>
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
