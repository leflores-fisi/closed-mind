import { useEffect, useState } from 'react';
import { API_URL, emitSocketEvent } from '@/services/userSocket';
import useAppReducer from '@/hooks/useAppReducer';
import { HiUsers } from 'react-icons/hi';

function PublicRoomsList() {

  const [roomsFetched, setRoomsFetched] = useState([]);
  const { store } = useAppReducer();

  const handleJoiningRoom = (room_code) => {
    emitSocketEvent['joining-to-chat']({
      room_code: room_code,
      user: {
        user_id: store.user_id,
        user_color: store.user_color
      }
    })
  }

  useEffect(() => {
    fetch(`${API_URL}/public_rooms`)
      .then(res => res.json())
      .then(publicRooms => setRoomsFetched(publicRooms))
  }, [])

  return (
    <div className='public-rooms-container'>   
      <header>Public rooms</header>
      <div className='public-rooms-list-wrapper'>
        {
          roomsFetched &&
          <ul className='public-rooms-list'>
            {
              roomsFetched.map((room, i) => (
                <li key={i} className='room-item'>
                  <button
                    className='join-to-room-btn'
                    onClick={() => handleJoiningRoom(room.code)}
                  >
                    <div className='room-info'>
                      <div className='room-name'>
                        {room.name}
                      </div>
                      <div className={`room-host ${room.host.user_color}`}>
                        {room.host.user_id.substring(0, room.host.user_id.length - 5)}
                      </div>
                    </div>
                    <div className='users-online'>
                      <div>{room.users_online}</div>
                      <HiUsers size={10}/>
                    </div>
                  </button>
                </li>
              ))
            }
          </ul>
        }
      </div>
    </div>
  );
}
export default PublicRoomsList;
