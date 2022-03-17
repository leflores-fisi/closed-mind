import UserForm from './UserForm';
import {motion} from 'framer-motion';
import './Welcome.scss';
import ClosedmindHeader from '../ClosedmindHeader';

function WelcomeWindow() {

  return (
    <motion.div className='welcome page' initial={{opacity: 0}} animate={{opacity: 1}}>
      <div className='wrapper'>
        <ClosedmindHeader/>
        <div className='container'>
          <div className='box-wrapper'>
            <figure>
              <h1 className='logo'>〰closed mind〰</h1>
              <h3 className='slogan'>
                <i>minimalist</i> and <i>fugacious</i> communication
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
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default WelcomeWindow;