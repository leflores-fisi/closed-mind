import './ChatWelcome.scss';

function EnteringChatHeader() {
  
  return (
    <div className='chat-welcome'>
      <button className='close-btn' onClick={() => {selfClose(true)}}>X</button>
      <header className='header'>〰Welcome to <span className='notranslate' translate='no'>closedmind!</span></header>
      <div className='content-container'>
      </div>
    </div>
  );
}
export default EnteringChatHeader;
