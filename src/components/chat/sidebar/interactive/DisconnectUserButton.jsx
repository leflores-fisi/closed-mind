import { userSocket } from "@/services/userSocket";

function DisconnectUserButton() {
  
  return (
    <button
      className='disconnect-user-btn'
      onClick={() => {
        userSocket.disconnect();
      }}
    >Disconnect
    </button>
  );
}
export default DisconnectUserButton;