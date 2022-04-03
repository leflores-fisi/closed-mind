import './ChatWelcome.scss';

function EnteringChatHeader({ input, forceUpdate, selfClose, lastRoom }) {

  const writeOnChatInput = (command) => {
    input.current.value = command;
    forceUpdate();
    input.current.focus();
  }
  
  return (
    <div className='chat-welcome'>
      <button className='close-btn' onClick={() => {selfClose(true)}}>X</button>
      <header className='header'>〰Welcome to <span className='notranslate' translate='no'>closedmind!</span></header>
      <div className='content-container'>
        <div className='snippet'>
          <button className='snippet-button' onClick={() => writeOnChatInput('/create ')}>
            Create a room
          </button>
        </div>
        <div className='snippet' onClick={() => writeOnChatInput('/join ' + (lastRoom ? lastRoom : ''))}>
          <button className='snippet-button'>
            {
              lastRoom
              ? 'Join to last room'
              : 'Join to a room'
            }
          </button>
        </div>
      </div>
    </div>
  );
}
export default EnteringChatHeader;
