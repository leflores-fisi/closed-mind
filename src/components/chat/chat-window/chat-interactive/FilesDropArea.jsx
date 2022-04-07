import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import dancing_dog_gif from '@/assets/emotes/dancing.gif';

/**
 * @callback onDropCallback
 * @param {FileList} fileList
 * @returns {number}
 * 
 */

/**
 * @param {object} params 
 * @param {onDropCallback} params.onDrop
 * 
 */
function FilesDropArea({ onDrop }) {

  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const drop = useRef(null);

  const handleDraggingToWindow = (e) => {
    console.log(e.dataTransfer)
    if (e.dataTransfer.types.includes('Files') ||
      e.dataTransfer.types.includes('application/x-moz-file')) {

      setIsDraggingFiles(true);
      drop.current.addEventListener('dragover',  handleDragOver);
      drop.current.addEventListener('drop',      handleDrop);
      drop.current.addEventListener('dragleave', finishDrag);
    }
  }

  useEffect(() => {
    window.addEventListener('dragenter', handleDraggingToWindow);

    return () => {
      window.removeEventListener('dragenter', handleDraggingToWindow);
      drop.current.removeEventListener('dragover',  handleDragOver);
      drop.current.removeEventListener('drop',      handleDrop);
      drop.current.removeEventListener('dragleave', finishDrag);
    };
  }, []);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const finishDrag = () => {
    drop.current.removeEventListener('dragover', handleDragOver);
    drop.current.removeEventListener('drop', handleDrop);
    drop.current.removeEventListener('dragleave', finishDrag);
    setIsDraggingFiles(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFiles(false);
  
    const {files} = e.dataTransfer;
    console.log('DROPPED FILES', e.dataTransfer)
    if (files.length > 0) onDrop(files);
  };

  return (
    isDraggingFiles
    ? <div className='overlay-area' ref={drop}
      >
        <motion.div
          className='modal-container no-pointer-events'
          animate={{y: 0}}
          initial={{y: 20}}
        >
          <div className='image-container'>
            <img src={dancing_dog_gif} height={96} width={96}/>
          </div>
          <div className='message'>
            <div className='title'>
              Yes! Dog wants your files
            </div>
            <div className='text'>
              <div className='subtitle'>Drop them anywhere</div>
              <ul>
                <li>Max size is 10mb</li>
                <li>We allow only images or videos</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    : null
  )
}
export default FilesDropArea;
