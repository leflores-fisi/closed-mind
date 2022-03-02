import UserForm from './UserForm';
import {motion} from 'framer-motion';
import './Welcome.scss';

function WelcomeWindow() {

  return (
    <motion.div className='welcome' initial={{opacity: 0}} animate={{
      opacity: 1
    }}>
      <div className='logo'>〰closed mind〰</div>
      <div className='slogan'>
        minimalist and fugacious chats (<i>if you want</i>)
      </div>
      <motion.div
        className='cards'
        initial={{y: 10}}
        animate={{y: 0}}
        transition={{duration: 1, delay: 0}}
      >
      
        <div className='card'><UserForm/></div>
        <div className='card'>
          <div className='features'>
            <div className='snippet'>
              <div className='command'>{`/create`}</div>
              <div className='argument'>{`<room-name>`}</div>
            </div>
            <div className='snippet'>
              <div className='command'>{`/connect`}</div>
              <div className='argument'>{`<room-name>`}</div>
            </div>
            <div className='snippet'>
              <div className='command'>{`/leave`}</div>
              <div className='argument'>{`<farewell>`}</div>
            </div>
            <div className='snippet'>
              <div className='command'>{`/ban`}</div>
              <div className='argument'>{`<dummy-user>`}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default WelcomeWindow;