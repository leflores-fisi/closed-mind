import { formatBytes } from '@/Helpers';
import { AiFillFileText } from 'react-icons/ai';

function AttachmentsPreview({ attachments, fileRemover }) {

  return (
    <div className='attachments-preview'>
      {
        attachments.map((attachment, i) => (
          <figure className='file-preview-container' key={i}>
            <div className='remove-file-btn'>
              <button onClick={() => fileRemover(i)}>x</button>
            </div>
            <div className='file-container'>
              <div className='file'>
                {
                  attachment.type.includes('image')
                  ? <img src={attachment.blobSrc}/> :

                  attachment.type.includes('video')
                  ? <video controls>
                      <source src={attachment.blobSrc} type={attachment.type}/>
                    </video>

                  : <div className='without-preview'>
                      <AiFillFileText size={70}/>
                      <div className='file-type'>{attachment.type}</div>
                      <div className='file-size'>{formatBytes(attachment.size)}</div>
                    </div>
                }
              </div>
            </div>
            <figcaption className='file-name'>
              <div className='text'>{attachment.name}</div>
              <div>{`(${i+1})`}</div>
            </figcaption>
          </figure>
        ))
      }
    </div>
  );
}
export default AttachmentsPreview;