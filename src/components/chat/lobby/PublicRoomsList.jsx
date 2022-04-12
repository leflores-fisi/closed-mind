import { useEffect, useState } from 'react';
import { API_URL, emitSocketEvent, userSocket } from '@/services/userSocket';
import useAppReducer from '@/hooks/useAppReducer';
import { HiUsers } from 'react-icons/hi';
import { ImSpinner2 } from 'react-icons/im';
import { RiArrowRightLine, RiArrowLeftLine } from 'react-icons/ri';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function PublicRoomsList() {

  const [roomsFetched, setRoomsFetched] = useState([]);
  const [searchIndex, setSearchIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);
  const [joiningError, setJoiningError] = useState('');

  const ROOMS_PER_PAGE = 6;
  const { store } = useAppReducer();

  const handleJoiningRoom = (room_code) => {
    emitSocketEvent['joining-to-chat']({
      room_code: room_code,
      user: {
        user_id: store.user_id,
        user_color: store.user_color
      },
      fromPublicList: true
    })
  }
  const fetchPublicRooms = (offset, fromRefreshing = false) => {
    let initialDate = Date.now();
    console.log('fetching with index', offset);
    //if (isEndReached) return;

    if (fromRefreshing) setIsRefreshing(true);
    else setIsFetching(true);

    fetch(`${API_URL}/public_rooms/${offset}`)
      .then(res => res.json())
      .then(publicRooms => {
        if (publicRooms.results.length <= ROOMS_PER_PAGE && publicRooms.results.length > 0) {
          setIsEndReached(false);
          setRoomsFetched(publicRooms.results);
        }
        else if (publicRooms.results.length === 0) {
          setRoomsFetched([]);
          setIsEndReached(true);
          console.log('EN REACHED');
        }
        if (fromRefreshing) setTimeout(() => setIsRefreshing(false), 1000);
        else setTimeout(() => setIsFetching(false), 500);
      })
  }

  // Joining to room error handler
  const handleError = ({ message }) => setJoiningError(message);
  useEffect(() => {
    userSocket.on('joining-error', handleError);
    return () => {
      userSocket.removeListener('joining-error', handleError)
    }
  }, [])

  useEffect(() => {
    console.log('Setting interval for fetching public rooms with 😳', searchIndex);
    let fetchInterval = window.setInterval(() => fetchPublicRooms(searchIndex, true), 10000);
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
        <div>Public rooms</div>
        <div className='spinner-container'>
          {(isFetching || isRefreshing) && <ImSpinner2 className='spinner' size={15}/>}
        </div>
      </header>
      <div className='public-rooms-list-wrapper'>
        {
          isFetching ?
          <Skeleton
            containerClassName='public-rooms-list'
            className='room-item'
            baseColor='#141515'
            highlightColor='#1b1c1d'
            height={34}
            count={6}
          /> :
          !isEndReached > 0
          ? <ul className='public-rooms-list'>
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
          : <div className='end-reached'>
              <div className='title'>Looks like you reached the end</div>
              <button onClick={() => setSearchIndex(0)}>Take me back</button>
            </div>
        }
      </div>
      <footer>
        { joiningError && <div className='red'>{joiningError}</div> }
        <div className='navigation'>
          <div className='rooms-count'>{searchIndex+1}</div>
          <button onClick={() => setSearchIndex(prev => (prev > 0 ? prev-1 : prev))}>
            <RiArrowLeftLine/> Back
          </button>
          <button onClick={() => setSearchIndex(prev => isEndReached ? prev : prev+1)}>
            More <RiArrowRightLine/>
          </button>
        </div>
      </footer>
    </section>
  );
}
export default PublicRoomsList;
