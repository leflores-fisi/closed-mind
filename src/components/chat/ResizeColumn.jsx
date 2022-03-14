
function ResizeColumn() {

  let removeListeners;

  const handleMouseMove = (e) => {
    let ChatSidebar = document.querySelector('.chat-sidebar');
    let ChatContent = document.querySelector('.chat-terminal');
    let sidebarInitialFlex = '0 0 300px';
    let chatInitialFlex    = '1 1 auto';

    if (e.clientX < 100) {
      ChatSidebar.style.flex = `0 0 0px`;
    }
    else if (e.clientX > document.body.clientWidth - 100) {
      ChatSidebar.style.flex = `1 1 auto`;
      ChatContent.style.flex = `0 0 0px`;
    }
    else if (e.clientX > 280 && e.clientX < 320) {
      ChatSidebar.style.flex = sidebarInitialFlex;
      ChatContent.style.flex = chatInitialFlex;
    }
    else {
      ChatSidebar.style.flex = `0 0 ${e.clientX-10}px`;
      ChatContent.style.flex = chatInitialFlex;
      document.body.style.cursor = 'col-resize';
    }
  }
  const handleMouseUp = () => {
    removeListeners()
    document.body.style.userSelect = 'auto';
    document.body.style.cursor = 'auto';
  };

  removeListeners = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  const handleResize = () => {
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  return (
    <div
      className='resize-column'
      onMouseDown={handleResize}
    />
  );
}
export default ResizeColumn;