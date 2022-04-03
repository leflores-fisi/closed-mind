import { useState } from 'react';
import { copyToClipboard } from '@/Helpers';
import { RiFileCopyLine } from 'react-icons/ri';
import { BsCheck2 } from 'react-icons/bs';
import HoverableTitle from '@/components/overlay/HoverableTitle';
import { AnimatePresence, motion } from 'framer-motion';

function CopyURLButton({ URL }) {
  
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!copied) {
      copyToClipboard(URL);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
  }

  return (
    <HoverableTitle title='Copy url'>
      <button onClick={handleCopy} className='copy-URL-btn'>
        {
          copied
          ? <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <BsCheck2/>
            </motion.span>

          : <AnimatePresence>
              <motion.span
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <RiFileCopyLine/>
              </motion.span>
            </AnimatePresence>
        }
      </button>
    </HoverableTitle>
  );
}
export default CopyURLButton;