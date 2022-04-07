import { motion } from 'framer-motion';
import angry_image from '@/assets/emotes/angry.gif';

function InvalidFilesOverlay({ invalidFiles, onClose }) {

  return (
    invalidFiles.length > 0
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
              Oh no! Some invalid files founded
            </div>
            <div className='text'>
              <div className='subtitle'>You provide</div>
              <ul>
              {
                invalidFiles.map((invalidFile, i) => {
                  console.log('Rendering invalid file information:', invalidFile)
                  return <li key={i}>{invalidFile.name}: {invalidFile.reason}</li>
                })
              }
              </ul>
            </div>
            <button onClick={onClose}>Im sorry!</button>
          </div>
        </motion.div>
      </div>
    : null
  )
}
export default InvalidFilesOverlay;
