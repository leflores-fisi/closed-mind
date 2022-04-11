import { motion } from 'framer-motion';
import Feature from './Feature';

function FeaturesCard() {

  const features = [
    {
      title: 'Create chat rooms',
      description: 'Just need some clicks'
    },
    {
      title: 'Enroll with friends',
      description: 'Share codes or join to a public room'
    },
    {
      title: 'Enroll with friends',
      description: 'Talk, share media, enjoy'
    },
  ]
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  const listItem = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  };
  
  return (
    <motion.ul className='features' variants={container} initial="hidden" animate="show">
      {
        features.map((feature, i) => (
          <motion.li className='feature-item' key={i} variants={listItem}>
            <Feature {...feature}/>
          </motion.li>
        ))
      }
    </motion.ul>
  );
}
export default FeaturesCard;