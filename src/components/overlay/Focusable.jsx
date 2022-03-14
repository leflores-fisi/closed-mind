import { useRef } from 'react';

function Focusable({ title, children, direction = 'up'}) {

  const wrapperRef = useRef(null);

  const showTitle = () => {
    let titleElement = document.querySelector('.app-overlay .title');
    titleElement.textContent = title;

    const {
      x:      childX,
      y:      childY,
      height: childHeight,
      width:  childWidth
    } = wrapperRef.current.getBoundingClientRect();

    const {
      width: titleWidth
    } = titleElement.getBoundingClientRect();

    let isOverflowing = childX + (titleWidth/2) + 5 > document.body.clientWidth;

    titleElement.style.left = (
      isOverflowing ? `${document.body.clientWidth - titleWidth - 5}px`
                    : `${childX - (titleWidth/2) + (childWidth/2)}px`
    )
    titleElement.style.top  = (
      direction === 'up'   ? `${childY - childHeight - 5}px` :
      direction === 'down' ? `${childY + childHeight + 15}px`
      : ''
    )
    titleElement.classList.add('showing');
  }
  const hideTitle = () => {
    document.querySelector('.app-overlay .title').classList.remove('showing');
    document.querySelector('.app-overlay .title').textContent = '';
    document.querySelector('.app-overlay .title').style.left  = `0px`;
    document.querySelector('.app-overlay .title').style.top   = `0px`;
  }

  return (
    <div
      className='focusable'
      ref={wrapperRef}
      onMouseEnter={showTitle}
      onMouseOut={hideTitle}
    >
      {children}
    </div>
  );
}
export default Focusable;