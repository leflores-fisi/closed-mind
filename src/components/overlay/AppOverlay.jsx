import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useOverlay from './../../hooks/useOverlay';
import { pxToNumber } from '../../Helpers';
import useAppReducer from '../../hooks/useAppReducer';
import './AppOverlay.scss'
import EmotePicker from './EmotePicker';

const ON_MOBILE_TOUCH_MODE = (
  window.matchMedia("(pointer: coarse)").matches === true
  && 'ontouchstart' in window
);

const dragListeners = {
  START: ON_MOBILE_TOUCH_MODE ? 'touchstart' : 'mousedown',
  MOVE:  ON_MOBILE_TOUCH_MODE ? 'touchmove'  : 'mousemove',
  END:   ON_MOBILE_TOUCH_MODE ? 'touchend'   : 'mouseup'
};

function getMouseCoords(e) {

  let x, y;
  if (ON_MOBILE_TOUCH_MODE) {
    x = e.touches[0]?.clientX || e.changedTouches[0].clientX;
    y = e.touches[0]?.clientY || e.changedTouches[0].clientY;
  }
  else {
    x = e.clientX;
    y = e.clientY;
  }

  return {x, y};
}

function AppOverlay() {

  const {onMobileRes, setOnMobileRes} = useOverlay();
  const {store} = useAppReducer();

  const isChatHidden       = useRef(false);
  const initialClickPosRef = useRef({});
  const initialChatPos     = useRef(0);
  const startTimestamp     = useRef(0);
  const scrollDirectionChecked = useRef(false);

  // Handle resize to make the chat and its sidebar responsive
  const handleResize = () => {
    let ChatTerminal = document.querySelector('.chat-terminal');
    
    if (document.body.clientWidth <= 800) {
      if (!onMobileRes) setOnMobileRes(true)
    }
    else {
      if (onMobileRes) setOnMobileRes(false);
      if (ChatTerminal) {
        // Chat opened and sidebar hidden
        ChatTerminal.style.pointerEvents = 'auto';
        ChatTerminal.style.left = 0;
        ChatTerminal.style.opacity = 1;
      }
    }
  }

  /*
  * handleDragging(), handleEndDrag(), handleStartDrag() and clearListeners()
  * works together as a drag system for the chat
  * 
  * First useEffect listen for drag start (mousedown or touchstart)
  * handleStartDrag() saves the initial click position, the timestamp and the initial chat pos
  * then listen for dragging (handleDragging()) and dragEnd (handleEndDrag())
  * 
  * handleDragging moves the chat by changing his left property
  * but first check if the drag was horizontal or vertically
  * if was vertically then clear all the listeners
  * 
  * on handleEndDrag() we have the logic to check if the chat was dragged
  * here we need the "initial timestamp" and "chat pos" to calculate the drag velocity
  * and finally we change the styles and clear the listeners
  */
  let clearListeners;
  const handleDragging = (e) => {
    let ChatTerminal = document.querySelector('.chat-terminal');
    let documentTop = document.body.clientWidth - 90;
    if (!scrollDirectionChecked.current) {
      // Vertical scrolling detected
      if (Math.abs(getMouseCoords(e).y - initialClickPosRef.current.y) > 4) {
        clearListeners();
        ChatTerminal.style.left = isChatHidden.current ? documentTop : 0;
        return;
      }
      // Horizontal scrolling detected
      else {
        document.querySelector('.command-lines-wrapper').style.overflowY = 'hidden';
        ChatTerminal.style.transition = 'width 1s';
        ChatTerminal.style.opacity = 1;
      }
      scrollDirectionChecked.current = true;
    }
    e.preventDefault();
    
    let posX = initialChatPos.current + (getMouseCoords(e).x - initialClickPosRef.current.x);
    let finalPos = (
      posX < 25 ? 0 :
      posX > documentTop ? documentTop :
      posX
    )
    ChatTerminal.style.left = `${finalPos}px`;
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
    e.preventDefault();
    clearListeners();
    scrollDirectionChecked.current = false;

    const ChatTerminal = document.querySelector('.chat-terminal');
    ChatTerminal.style.transition = 'width 1s, left 0.15s';
    ChatTerminal.addEventListener('transitionend', handleChatTransitionEnd);
    document.querySelector('.command-lines-wrapper').style.overflowY = 'auto';

    let dragVelocity = ((getMouseCoords(e).x - initialClickPosRef.current.x) / (Date.now() - startTimestamp.current));
    let finalDragPos = ChatTerminal.getBoundingClientRect().left;
    let halfDocument = document.body.clientWidth/2;
    console.log('Drag velocity', dragVelocity);

    // Dropped on right
    if (isChatHidden.current) {
      // Just a click
      if (dragVelocity === 0) {
        // If user clicks on the chat right, then it opens
        if (getMouseCoords(e).x > document.body.clientWidth - 80) {
          ChatTerminal.style.opacity = 1;
          ChatTerminal.style.left = '0px';
          isChatHidden.current = false; // now is visible
          return;
        }
      }
      // Opening the chat by dragging (negative velocity means left drag)
      else if ((finalDragPos < halfDocument) || (dragVelocity < -0.5)) {
        ChatTerminal.style.left = '0px';
        isChatHidden.current = false;
      }
      // Nothing happens, chat still close
      else {
        ChatTerminal.style.left = 'calc(100% - 90px)'; // hiding position
        isChatHidden.current = true;
      }
    }
    // Chat is visible
    else {
      // Closing the chat by dragging to right
      if ((finalDragPos > halfDocument) || (dragVelocity > 0.5)) {
        ChatTerminal.style.left = 'calc(100% - 90px)';
        isChatHidden.current = true;
      }
      // Nothing happens, chat still open
      else {
        ChatTerminal.style.left = '0px';
        isChatHidden.current = false;
      }
    }
  }
  const handleStartDrag = (e) => {
    e.preventDefault();
    // If is a click event and the mouse button is not left
    if (e.button !== undefined && e.button !== 0) {
      return;
    }
    let ChatTerminal = document.querySelector('.chat-terminal');
    initialClickPosRef.current = getMouseCoords(e);
    startTimestamp.current = Date.now(); // to check the drag velocity
    initialChatPos.current = ChatTerminal.getBoundingClientRect().left;
    scrollDirectionChecked.current = false;
    // starts listening for drag and drag end
    document.body.addEventListener(dragListeners.MOVE, handleDragging);
    document.body.addEventListener(dragListeners.END, handleEndDrag);
  }
  clearListeners = () => {
    document.body.removeEventListener(dragListeners.MOVE, handleDragging);
    document.body.removeEventListener(dragListeners.END, handleEndDrag);
    document.querySelector('.chat-terminal').removeEventListener('transitionend', handleChatTransitionEnd);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    console.log('Changing to mobile res?:', onMobileRes)
    if (onMobileRes && store.socket_is_connected)
      document.body.addEventListener(dragListeners.START, handleStartDrag);
    else
      document.body.removeEventListener(dragListeners.START, handleStartDrag);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.removeEventListener(dragListeners.START, handleStartDrag);
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
      <motion.div
        className='emote-picker'
        whileInView={{opacity: 1}}
        initial={{opacity: 0}}
        transition={{duration: 0.2, delay: 0.25}}
      >
        <EmotePicker/>
      </motion.div>
    </div>
  );
}
export default AppOverlay;