import UserForm from './UserForm';
import {motion} from 'framer-motion';
import ClosedmindHeader from '../ClosedmindHeader';
import ClosedmindLogo from '../ClosedmindLogo';
import FeaturesCard from './features/FeaturesCard';
import './Welcome.scss';

function WelcomeWindow() {

  return (
    <motion.div className='welcome page' initial={{opacity: 0}} animate={{opacity: 1}}>
      <div className='wrapper'>
        <ClosedmindHeader/>
        <div className='container'>
          <div className='box-wrapper'>
            <div className='left'>
              <div className='card'>
                <header>Get into the chat!</header>
                <UserForm/>
              </div>
            </div>
            <div className='right'>
              <figure initial={{y: 10}}
                animate={{y: 0}}
                transition={{duration: 1, delay: 0}}>
                <ClosedmindLogo width={60} opacity={0.8}/>
                <h1 className='logo'>〰closedmind〰</h1>
                <h3 className='slogan'>
                  <i>minimalist</i> and <i>fugacious</i> communication
                </h3>
              </figure>
              <div className='card'>
                <FeaturesCard/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default WelcomeWindow;

/*
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
 */