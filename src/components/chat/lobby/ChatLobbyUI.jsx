import CreateRoomForm from './CreateRoomForm';
import JoinToRoomForm from './JoinToRoomForm';
import PublicRoomsList from './PublicRoomsList';
import RoomsHistory from './RoomsHistory';
import './ChatLobby.scss';

function ChatLobbyUI() {
  
  return (
    <div className='closedmind-chat-lobby'>
      <section className='joining-options-container'>
        <CreateRoomForm/>
        <JoinToRoomForm/>
      </section>
      <div className='rooms-options-container'>
        <PublicRoomsList/>
        <RoomsHistory/>
      </div>
    </div>
  );
}
export default ChatLobbyUI;
