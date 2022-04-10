import unable_to_load_img from '@/assets/app-messages/unable-to-load.jpg';
import useOverlay from '@/hooks/useOverlay';
import { useEffect, useState } from 'react';

function ImageAttachment({ src, name, }) {

  const { setImageOnDetail } = useOverlay()

  useEffect(() => {

  });

  const openImage = () => {

    setImageOnDetail({
      src: src,
      name: name
    })
  }

  return (
    <div className='image-attachment-container'>
      <button onClick={openImage}>
        <img
          src={src}
          alt={name || 'Unable to load'}
          loading='lazy'
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = unable_to_load_img;
          }}
        />
      </button>
    </div>
  );
}
export default ImageAttachment;
