import UserForm from './UserForm';
import {motion} from 'framer-motion';
import ClosedmindHeader from '../ClosedmindHeader';
import ClosedmindLogo from '../ClosedmindLogo';
import {BsTerminal} from 'react-icons/bs';
import {IoPeopleOutline} from 'react-icons/io5';
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
                <ul className='features'>
                  <li className='feature-item'>
                    <div className='wrapper'>
                      <BsTerminal className='icon' size='1.5rem' color='var(--app-color)'/>
                      <div className='content'>
                        <div className='title'>Create chat rooms</div>
                        <div className='description'>Just type /create</div>
                      </div>
                    </div>
                  </li>
                  <li className='feature-item'>
                    <div className='wrapper'>
                      <IoPeopleOutline className='icon' size='1.5rem' color='var(--app-color)'/>
                      <div className='content'>
                        <div className='title'>Create chat rooms</div>
                        <div className='description'>Just type /create</div>
                      </div>
                    </div>
                  </li>
                  <li className='feature-item'>
                    <div className='wrapper'>
                      <IoPeopleOutline className='icon' size='1.5rem' color='var(--app-color)'/>
                      <div className='content'>
                        <div className='title'>Enroll with friends</div>
                        <div className='description'>Talk, share videos, make polls</div>
                      </div>
                    </div>
                  </li>
                </ul>
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