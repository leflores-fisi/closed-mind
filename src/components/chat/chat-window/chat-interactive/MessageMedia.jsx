import { useEffect } from 'react';
import unable_to_load_img from '@/assets/app-messages/unable-to-load.jpg';

function MessageMedia({ mediaFiles }) {

  useEffect(() => {

  })
  
  return (
    mediaFiles.length > 0 &&
    <div className='message-media'>
      {
        mediaFiles.map(mediaResource => (
          <div className='media-wrapper' role='button' key={mediaResource.title}>
            {
              mediaResource.type.includes('image') ?
                <img
                  src={mediaResource.url}
                  alt={mediaResource.title || 'image'}
                  loading='lazy'
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = unable_to_load_img;
                  }}
                /> :
              mediaResource.type.includes('video') ?
                <video controls>
                  <source src={mediaResource.url} type={mediaResource.type || 'video/mp4'}/>
                </video>
              : <img src={unable_to_load_img}></img>
            }
          </div>
        ))
      }
    </div>
  );
}
export default MessageMedia;
