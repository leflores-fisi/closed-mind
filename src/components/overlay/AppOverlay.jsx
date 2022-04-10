import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import unable_to_load_img from '@/assets/app-messages/unable-to-load.jpg';

import useOverlay    from '@/hooks/useOverlay';
import useAppReducer from '@/hooks/useAppReducer';
import './AppOverlay.scss'

// Check if the browser has touch events
const ON_MOBILE_TOUCH_MODE = (
  window.matchMedia('(pointer: coarse)').matches === true
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

  const {onMobileRes, setOnMobileRes, imageOnDetail, setImageOnDetail} = useOverlay();
  const {store} = useAppReducer();

  const isChatHidden       = useRef(false);
  const initialClickPosRef = useRef({});
  const initialChatPos     = useRef(0);
  const startTimestamp     = useRef(0);
  const scrollDirectionChecked = useRef(false);

  // Handle resize to make the chat and its sidebar responsive
  const handleResize = () => {
    let ChatWindow = document.querySelector('.chat-window');
    
    if (document.body.clientWidth <= 800) {
      if (!onMobileRes) setOnMobileRes(true)
    }
    else {
      if (onMobileRes) setOnMobileRes(false);
      if (ChatWindow) {
        // Chat opened and sidebar hidden
        ChatWindow.style.pointerEvents = 'auto';
        ChatWindow.style.left = 0;
        ChatWindow.style.opacity = 1;
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
    let ChatWindow = document.querySelector('.chat-window');
    let documentTop = document.body.clientWidth - 90;
    if (!scrollDirectionChecked.current) {
      // Vertical scrolling detected
      if (Math.abs(getMouseCoords(e).y - initialClickPosRef.current.y) > 4) {
        clearListeners();
        ChatWindow.style.left = isChatHidden.current ? documentTop : 0;
        return;
      }
      // Horizontal scrolling detected
      else {
        document.querySelector('.chat-lines-wrapper').style.overflowY = 'hidden';
        ChatWindow.style.transition = 'width 1s';
        ChatWindow.style.opacity = 1;
      }
      scrollDirectionChecked.current = true;
    }
    
    let posX = initialChatPos.current + (getMouseCoords(e).x - initialClickPosRef.current.x);
    let finalPos = (
      posX < 25 ? 0 :
      posX > documentTop ? documentTop :
      posX
    )
    ChatWindow.style.left = `${finalPos}px`;
  }
  const handleChatTransitionEnd = () => {
    let ChatWindow = document.querySelector('.chat-window');
    if (isChatHidden.current && onMobileRes) {
      ChatWindow.style.opacity = 0.6;
      ChatWindow.style.pointerEvents = 'none';
    }
    else {
      ChatWindow.style.opacity = 1;
      ChatWindow.style.pointerEvents = 'auto';
    }
    clearListeners();
  }
  const handleEndDrag = (e) => {
    clearListeners();
    scrollDirectionChecked.current = false;

    const ChatWindow = document.querySelector('.chat-window');
    ChatWindow.style.transition = 'width 1s, left 0.15s';
    ChatWindow.addEventListener('transitionend', handleChatTransitionEnd);
    document.querySelector('.chat-lines-wrapper').style.overflowY = 'auto';

    let dragVelocity = ((getMouseCoords(e).x - initialClickPosRef.current.x) / (Date.now() - startTimestamp.current));
    let finalDragPos = ChatWindow.getBoundingClientRect().left;
    let halfDocument = document.body.clientWidth/2;
    console.log('Drag velocity', dragVelocity);

    // Dropped on right
    if (isChatHidden.current) {
      // Just a click
      if (dragVelocity === 0) {
        // If user clicks on the chat right, then it opens
        if (getMouseCoords(e).x > document.body.clientWidth - 80) {
          ChatWindow.style.opacity = 1;
          ChatWindow.style.left = '0px';
          isChatHidden.current = false; // now is visible
          return;
        }
      }
      // Opening the chat by dragging (negative velocity means left drag)
      else if ((finalDragPos < halfDocument) || (dragVelocity < -0.5)) {
        ChatWindow.style.left = '0px';
        isChatHidden.current = false;
      }
      // Nothing happens, chat still close
      else {
        ChatWindow.style.left = 'calc(100% - 90px)'; // hiding position
        isChatHidden.current = true;
        document.querySelector('.textarea-input').blur();
      }
    }
    // Chat is visible
    else {
      // Closing the chat by dragging to right
      if ((finalDragPos > halfDocument) || (dragVelocity > 0.5)) {
        ChatWindow.style.left = 'calc(100% - 90px)';
        isChatHidden.current = true;
        document.querySelector('.textarea-input').blur();
      }
      // Nothing happens, chat still open
      else {
        ChatWindow.style.left = '0px';
        isChatHidden.current = false;
      }
    }
  }
  const handleStartDrag = (e) => {
    // If is a click event and the mouse button is not left
    if (e.button !== undefined && e.button !== 0) {
      return;
    }
    let ChatWindow = document.querySelector('.chat-window');
    initialClickPosRef.current = getMouseCoords(e);
    startTimestamp.current = Date.now(); // to check the drag velocity
    initialChatPos.current = ChatWindow.getBoundingClientRect().left;
    scrollDirectionChecked.current = false;
    // starts listening for drag and drag end
    document.body.addEventListener(dragListeners.MOVE, handleDragging);
    document.body.addEventListener(dragListeners.END, handleEndDrag);
  }
  clearListeners = () => {
    document.body.removeEventListener(dragListeners.MOVE, handleDragging);
    document.body.removeEventListener(dragListeners.END, handleEndDrag);
    document.querySelector('.chat-window').removeEventListener('transitionend', handleChatTransitionEnd);
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
      {
        imageOnDetail.src &&
        <div className='image-detail-overlay' onClick={() => setImageOnDetail({})}>
          <motion.picture
            className='image-detail-container'
            onClick={(e) => e.stopPropagation()}
            initial={{y: 50, scale: 0.8}}
            animate={{y: 0, scale: 1}}
          >
            <img
              src={imageOnDetail.src}
              alt={imageOnDetail.name || 'Unable to load'}
              loading='lazy'
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = unable_to_load_img;
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.picture>
        </div>
      }
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