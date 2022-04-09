import { motion } from 'framer-motion';
import angry_image from '@/assets/emotes/angry.gif';

function InvalidFilesOverlay({ filesAreInvalid, onClose }) {

  return (
    filesAreInvalid
    ? <div
        className='overlay-area'
        onClick={onClose}
        onTouchStart={onClose}
      >
        <motion.div
          className='modal-container'
          animate={{y: 0}}
          initial={{y: 20}}
          onClick={(e) => {e.stopPropagation()}}
          onMouseDown={(e) => {e.stopPropagation()}}
          onMouseMove={(e) => {e.stopPropagation()}}
          onMouseUp={(e) => {e.stopPropagation()}}
        >
          <div className='image-container'>
            <img src={angry_image} height={96} width={96}/>
          </div>
          <div className='message'>
            <div className='title'>
              Oh no!
            </div>
            <div className='text'>
              <div className='subtitle'>{filesAreInvalid.reason}</div>
            </div>
            <button onClick={onClose}>Im sorry!</button>
          </div>
        </motion.div>
      </div>
    : null
  )
}
export default InvalidFilesOverlay;
