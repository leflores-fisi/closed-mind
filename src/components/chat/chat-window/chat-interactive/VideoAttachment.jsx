import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiFillPlayCircle } from 'react-icons/ai';

function VideoAttachment({ src, type, name }) {

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const openVideoControls = () => {
    videoRef.current.setAttribute('controls', 'true');
    videoRef.current.play();
    console.log('Playing...', videoRef.current)
  }

  return (
    <div className='video-attachment-container'>
      <AnimatePresence >
        {
          !isPlaying &&
          < >
              <motion.header
                exit={{y: -100}}
                animate={{y: 0}}
                initial={{y: -80}}
                key='header'
              >
                <div>{name}</div>
              </motion.header>
              <div className='play-button'>
                <motion.div
                  key={'wrapper'}
                  className='icon-wrapper'
                  animate={{scale: 1}}
                  initial={{scale: 0.2}}
                  exit={{scale: 0}}
                >
                  <AiFillPlayCircle size={50}/>
                </motion.div>
              </div>
          </>
        }
      </AnimatePresence>
      <video
        ref={videoRef}
        onClick={openVideoControls}
        onPlay ={() => setIsPlaying(true) }
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={src} type={type || 'video/mp4'}/>
      </video>
    </div>
  );
}
export default VideoAttachment;