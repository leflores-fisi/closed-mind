import './TerminalWelcome.scss';

function TerminalWelcomeHeader({ input, forceUpdate, close }) {

  const writeOnTerminal = (command) => {
    input.current.value = command;
    forceUpdate();
  }
  
  return (
    <div className='terminal-welcome'>
      <button className='close-btn' onClick={() => {close(true)}}>X</button>
      <header className='header'>〰Welcome to closedmind!</header>
      <div className='content-container'>
        <div className='snippet'>
          <button className='snippet-button' onClick={() => writeOnTerminal('/create ')}>
            Create a room
          </button>
        </div>
        <div className='snippet' onClick={() => writeOnTerminal('/join ')}>
          <button className='snippet-button'>
            Join to a room
          </button>
        </div>
      </div>
    </div>
  );
}
export default TerminalWelcomeHeader;