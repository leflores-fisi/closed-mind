import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useOverlay from './../../hooks/useOverlay';
import './AppOverlay.scss'

function AppOverlay() {

  const {onMobileRes, setOnMobileRes} = useOverlay();

  const handleResize = () => {

    if (document.body.clientWidth <= 800) {
      if (!onMobileRes) setOnMobileRes(true)
    }
    else {
      if (onMobileRes) setOnMobileRes(false)
    }
  }

  useEffect(() => {
    //handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onMobileRes])

  return (
    <div className='app-overlay'>
      <motion.div
        className='title'
        whileInView={{opacity: 1}}
        initial={{opacity: 0}}
        transition={{duration: 0.2, delay: 0.25}}
      />
    </div>
  );
}
export default AppOverlay;