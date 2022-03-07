import UserForm from './UserForm';
import {motion} from 'framer-motion';
import './Welcome.scss';
import { useEffect } from 'react';

function WelcomeWindow() {

  
  useEffect(() => {
    // let logo    = document.querySelector('#closed-mind-logo');
    // let content = document.querySelector('#cards');
  
    // let logo_h   = logo.getBoundingClientRect().height;
    // let content_h   = content.getBoundingClientRect().height;
    // let doc_h = document.body.clientHeight;
    // let a = ((doc_h - content_h) / 2);
  
    // content.style.top = `${a}px`;
    // logo.style.top = `${a - logo_h}px`;
    
    // function viewportHandler(event) {
      
    //   let logo    = document.querySelector('#closed-mind-logo');
    //   let content = document.querySelector('#cards');
    
    //   let logo_h   = logo.getBoundingClientRect().height;
    //   let content_h   = content.getBoundingClientRect().height;
    //   let doc_h = document.body.clientHeight;
    //   let a = ((doc_h - content_h) / 2);
    
    //   content.style.top = `${a}px`;
    //   logo.style.top = `${a - logo_h}px`;
    // }
    // window.visualViewport.addEventListener("resize", viewportHandler);
  }, [])

  return (
    <motion.div className='welcome page' initial={{opacity: 0}} animate={{
      opacity: 1
    }}>
      <div className='wrapper'>
        <figure>
          <h1 className='logo'>〰closed mind〰</h1>
          <h3 className='slogan'>
            minimalist and fugacious communication
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
        <figure>
        </figure>
      </div>
      
      <footer className='closed-mind-github'>
        Check the project on <a target='_blank' href='https://github.com/leflores-fisi/closed-mind'>github 💖</a>
      </footer>
    </motion.div>
  )
}

export default WelcomeWindow;