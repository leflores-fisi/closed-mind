import './TerminalWelcome.scss';

function TerminalWelcomeHeader({ input, forceUpdate, selfClose, lastRoom }) {

  const writeOnTerminal = (command) => {
    input.current.value = command;
    forceUpdate();
  }
  
  return (
    <div className='terminal-welcome'>
      <button className='close-btn' onClick={() => {selfClose(true)}}>X</button>
      <header className='header'>〰Welcome to closedmind!</header>
      <div className='content-container'>
        <div className='snippet'>
          <button className='snippet-button' onClick={() => writeOnTerminal('/create ')}>
            Create a room
          </button>
        </div>
        <div className='snippet' onClick={() => writeOnTerminal('/join ' + (lastRoom ? lastRoom : ''))}>
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
export default TerminalWelcomeHeader;