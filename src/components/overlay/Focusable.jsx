import { useRef } from 'react';

function Focusable({ title, children, direction = 'up'}) {

  const wrapperRef = useRef(null);

  const showTitle = () => {
    let TitleFrame = document.querySelector('.app-overlay .title');
    TitleFrame.textContent = title;

    const {
      x:      childX,
      y:      childY,
      height: childHeight,
      width:  childWidth
    } = wrapperRef.current.getBoundingClientRect();

    const {
      width: titleWidth
    } = TitleFrame.getBoundingClientRect();

    let isOverflowing = childX + (titleWidth/2) + 5 > document.body.clientWidth;

    TitleFrame.style.left = (
      isOverflowing ? `${document.body.clientWidth - titleWidth - 5}px`
                    : `${childX - (titleWidth/2) + (childWidth/2)}px`
    )
    TitleFrame.style.top  = (
      direction === 'up'   ? `${childY - childHeight - 5}px` :
      direction === 'down' ? `${childY + childHeight + 15}px`
      : ''
    )
    TitleFrame.classList.add('showing');
  }
  const hideTitle = () => {
    const TitleFrame = document.querySelector('.app-overlay .title');
    TitleFrame.classList.remove('showing');
    TitleFrame.textContent = '';
    TitleFrame.style.left  = `0px`;
    TitleFrame.style.top   = `0px`;
  }

  return (
    <div
      className='focusable'
      ref={wrapperRef}
      onMouseEnter={showTitle}
      onMouseOut={hideTitle}
      onBlur={hideTitle}
    >
      {children}
    </div>
  );
}
export default Focusable;