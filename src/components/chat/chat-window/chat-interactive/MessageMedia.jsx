import { useEffect } from 'react';
import unable_to_load_img from '@/assets/app-messages/unable-to-load.jpg';

function MessageMedia({ media }) {

  useEffect(() => {

  })
  
  return (
    media.length > 0 &&
    <div className='message-media'>
      {
        media.map(resource => (
          <div className='media-wrapper' role='button' key={resource.title}>
            <img
              src={resource.url}
              alt={resource.title || 'image'}
              loading='lazy'
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = unable_to_load_img;
              }}
            />
          </div>
        ))
      }
    </div>
  );
}
export default MessageMedia;
