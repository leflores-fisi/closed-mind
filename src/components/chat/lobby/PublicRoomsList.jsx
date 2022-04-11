import { useEffect, useState } from 'react';
import { API_URL, emitSocketEvent } from '@/services/userSocket';
import useAppReducer from '@/hooks/useAppReducer';
import { HiUsers } from 'react-icons/hi';
import { ImSpinner2 } from 'react-icons/im';

function PublicRoomsList() {

  const [roomsFetched, setRoomsFetched] = useState([]);
  const [totalCount, setTotalCount] = useState([]);
  const [searchIndex, setSearchIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const ROOMS_PER_PAGE = 5;
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
  const fetchPublicRooms = (offset) => {
    let initialDate = Date.now();
    console.log('fetching with index', offset)
    setIsFetching(true);
    fetch(`${API_URL}/public_rooms/${offset}`)
      .then(res => res.json())
      .then(publicRooms => {
        if (publicRooms.results.length > 0) {
          setRoomsFetched(publicRooms.results);
        }
        //setTotalCount(publicRooms.total)
        setTimeout(() => setIsFetching(false), 500)
      })
  }

  useEffect(() => {
    console.log('Setting interval for fetching public rooms with 😳', searchIndex);
    let fetchInterval = window.setInterval(() => fetchPublicRooms(searchIndex), 5000);
    return () => {
      console.log('Clearing interval for fetching public rooms 😳');
      window.clearInterval(fetchInterval);
    }
  }, [searchIndex])

  useEffect(() => {
    fetchPublicRooms(searchIndex);
  }, [searchIndex])

  return (
    <section className='public-rooms-container'>   
      <header>
        <div className='spinner-container'>
          {isFetching && <ImSpinner2 className='spinner' size={15}/>}
        </div>
        <div>Public rooms</div>
      </header>
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
      <footer>
        <div className='rooms-count'>{totalCount}</div>
        <div className='navigation'>
          <button onClick={() => setSearchIndex(prev => (prev > 0 ? prev-1 : prev))}>Less</button>
          <button onClick={() => setSearchIndex(prev => prev+1)}>More</button>
        </div>
      </footer>
    </section>
  );
}
export default PublicRoomsList;
