import ChatOptions from './ChatOptions';

function TerminalRoomHeader({ roomCode, usersQuantity }) {
  
  return (
    <div className='terminal-room-header'>
      <div>
        <div className='room-name'>
          {roomCode.substring(0, roomCode.length - 5)}
        </div>
        <div className='users-online'>
          {usersQuantity > 1
            ? `👥 ${usersQuantity} users online`
            : `👤 ${usersQuantity} user online`}
        </div>
      </div>
      <ChatOptions/>
    </div>
  );
}
export default TerminalRoomHeader;