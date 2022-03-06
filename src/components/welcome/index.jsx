import UserForm from './UserForm';
import {motion} from 'framer-motion';
import './Welcome.scss';

function WelcomeWindow() {

  return (
    <motion.div className='welcome page' initial={{opacity: 0}} animate={{
      opacity: 1
    }}>
      <figure>
        <h1 className='logo'>〰closed mind〰</h1>
        <h3 className='slogan'>
          minimalist and fugacious chats (<i>if you want</i>)
        </h3>
      </figure>
      <motion.div
        className='cards'
        initial={{y: 10}}
        animate={{y: 0}}
        transition={{duration: 1, delay: 0}}
      >
      
        <div className='card'>
          <UserForm/>
        </div>

        <div className='card'>
          <ul className='features'>
            <li className='snippet'>
              <div className='command'>{`/create`}</div>
              <div className='argument'>{`<room-name>`}</div>
            </li>
            <li className='snippet'>
              <div className='command'>{`/join`}</div>
              <div className='argument'>{`<room-name>`}</div>
            </li>
            <li className='snippet'>
              <div className='command'>{`/leave`}</div>
              <div className='argument'>{`<farewell>`}</div>
            </li>
            <li className='snippet'>
              <div className='command'>{`/ban`}</div>
              <div className='argument'>{`<dummy-user>`}</div>
            </li>
          </ul>
        </div>
      </motion.div>
      <footer className='closed-mind-github'>
        Check the project on <a target='_blank' href='https://github.com/leflores-fisi/closed-mind'>github 💖</a>
      </footer>
    </motion.div>
  )
}

export default WelcomeWindow;