import CreateRoomForm from './CreateRoomForm';
import JoinToRoomForm from './JoinToRoomForm';
import PublicRoomsList from './PublicRoomsList';
import RoomsHistory from './RoomsHistory';
import './ChatLobby.scss';

function ChatLobbyUI() {
  
  return (
    <div className='closedmind-chat-lobby'>
      <div className='joining-options-container'>
        <CreateRoomForm/>
        <JoinToRoomForm/>
      </div>
      <div className='rooms-options-container'>
        <PublicRoomsList/>
        <RoomsHistory/>
      </div>
    </div>
  );
}
export default ChatLobbyUI;
