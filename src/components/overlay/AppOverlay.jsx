import { motion } from 'framer-motion';
import './AppOverlay.scss'

function AppOverlay() {

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