import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useOverlay from './../../hooks/useOverlay';
import { pxToNumber } from '../../Helpers';
import useAppReducer from '../../hooks/useAppReducer';
import './AppOverlay.scss'

function AppOverlay() {

  const {onMobileRes, setOnMobileRes} = useOverlay();
  const {store} = useAppReducer();

  const isChatHidden   = useRef(false);
  const clickPosRef    = useRef({});
  const initialChatPos = useRef(0);
  const startTimestamp = useRef(0);
  
  // Handle resize to make the chat and its sidebar responsive
  const handleResize = () => {
    if (document.body.clientWidth <= 800) {
      if (!onMobileRes) setOnMobileRes(true)
    }
    else {
      if (onMobileRes) {
        setOnMobileRes(false);
        document.querySelector('.chat-terminal').style.opacity = 1;
        document.querySelector('.chat-terminal').style.pointerEvents = 'auto';
      }
      if (store.socket_is_connected) document.querySelector('.chat-terminal').style.left = 0
    }
  }

  /*
  * handleDragging(), handleEndDrag(), handleStartDrag() and clearListeners()
  * works together
  *
  */
  let clearListeners;
  const handleDragging = (e) => {
    let posX = initialChatPos.current + (e.clientX - clickPosRef.current.x);
    let documentTop = document.body.clientWidth - 90;
    //if (e.clientY !== clickPosRef.current.y) return;

    let finalPos = (
      posX < 0 ? 0 :
      posX > documentTop ? documentTop :
      posX
    )
    document.querySelector('.chat-terminal').style.left = `${finalPos}px`;
  }
  const handleChatTransitionEnd = () => {
    let ChatTerminal = document.querySelector('.chat-terminal');
    if (isChatHidden.current && onMobileRes) {
      ChatTerminal.style.opacity = 0.6;
      ChatTerminal.style.pointerEvents = 'none';
    }
    else {
      ChatTerminal.style.opacity = 1;
      ChatTerminal.style.pointerEvents = 'auto';
    }
    clearListeners();
  }
  const handleEndDrag = (e) => {
    clearListeners();
    const ChatTerminal = document.querySelector('.chat-terminal');
    ChatTerminal.style.transition = 'width 1s, left 0.5s';
    ChatTerminal.addEventListener('transitionend', handleChatTransitionEnd)

    let dragVelocity = ((e.clientX - clickPosRef.current.x) / (Date.now() - startTimestamp.current));
    let finalDragPos = document.querySelector('.chat-terminal').getBoundingClientRect().left;
    let halfDocument = document.body.clientWidth/2;

    // Dropped on right
    if (isChatHidden.current) {
      if (finalDragPos < halfDocument || (dragVelocity < -0.5 || dragVelocity === 0)) {
        ChatTerminal.style.left = '0px';
        isChatHidden.current = false;
      }
      else {
        ChatTerminal.style.left = 'calc(100% - 90px)';
        isChatHidden.current = true;
      }
    }
    else {
      if (finalDragPos > halfDocument || dragVelocity > 0.5) {
        ChatTerminal.style.left = 'calc(100% - 90px)';
        isChatHidden.current = true;
      }
      else {
        ChatTerminal.style.left = '0px';
        isChatHidden.current = false;
      }
    }
  }
  const handleStartDrag = (e) => {
    clickPosRef.current = {x: e.clientX, y: e.clientY};
    startTimestamp.current = Date.now();
    initialChatPos.current = document.querySelector('.chat-terminal').getBoundingClientRect().left;
    document.querySelector('.chat-terminal').style.opacity = 1;
    document.querySelector('.chat-terminal').style.transition = 'width 1s';
    document.body.addEventListener('mousemove', handleDragging);
    document.body.addEventListener('mouseup', handleEndDrag);
  }
  clearListeners = () => {
    document.body.removeEventListener('mousemove', handleDragging);
    document.body.removeEventListener('mouseup', handleEndDrag);
    document.querySelector('.chat-terminal').removeEventListener('transitionend', handleChatTransitionEnd);
  }

  useEffect(() => {
    console.log('shooting', onMobileRes)
    window.addEventListener('resize', handleResize);
    if (onMobileRes && store.socket_is_connected)
      document.body.addEventListener('mousedown', handleStartDrag);
    else
      document.body.removeEventListener('mousedown', handleStartDrag);
    return () => {
      console.log('removing effects')
      window.removeEventListener('resize', handleResize);
      document.body.removeEventListener('mousedown', handleStartDrag);
    };
  }, [onMobileRes, store.socket_is_connected])

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