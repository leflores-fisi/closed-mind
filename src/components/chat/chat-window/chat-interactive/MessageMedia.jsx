import { useEffect } from 'react';
import { AiFillFile } from 'react-icons/ai';
import { MdOutlineFileDownload } from 'react-icons/md';
import unable_to_load_img from '@/assets/app-messages/unable-to-load.jpg';
import { formatBytes } from '@/Helpers';

function MessageMedia({ mediaFiles }) {

  useEffect(() => {

  })
  
  return (
    mediaFiles.length > 0 &&
    <div className='message-media'>
      {
        mediaFiles.map((mediaResource, i) => (
          <div className='media-wrapper' role='button' key={i}>
            {
              mediaResource.type.includes('image')
              ? <img
                  src={mediaResource.url}
                  alt={mediaResource.fileName || 'image'}
                  loading='lazy'
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = unable_to_load_img;
                  }}
                /> :

              mediaResource.type.includes('video')
              ? <video controls>
                  <source src={mediaResource.url} type={mediaResource.type || 'video/mp4'}/>
                </video>

              : <div className='other-file-viewer'>
                  <div className='file-icon-container'>
                    <div className='file-icon'>
                      <AiFillFile size={90}/>
                    </div>
                    <div className='file-format'>
                      {mediaResource.format}
                    </div>
                  </div>
                  <div className='content-information'>
                    <div className='file-name'>{mediaResource.fileName}</div>
                    <div className='file-size'>{formatBytes(mediaResource.size)}</div>
                  </div>
                  <div className='download-file'>
                    <a href={mediaResource.url} target='_blank'>
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
export default MessageMedia;
