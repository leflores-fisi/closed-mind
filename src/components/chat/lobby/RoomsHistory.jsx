import { useState } from 'react';
import { getRoomsHistory, removeRoomFromHistory } from '@/Helpers';
import useAppReducer from '@/hooks/useAppReducer';
import { setGlobalUsername, setGlobalColor } from '@/context/actions';
import { emitSocketEvent } from '@/services/userSocket';
import { MdClose } from 'react-icons/md';

function RoomsHistory() {

  const [history, setHistory] = useState(getRoomsHistory());
  const { dispatch } = useAppReducer();

  const handleJoiningRoom = (room_code, user_id, user_color) => {
    
    dispatch(setGlobalUsername({
      username: user_id.split('#')[0],
      userCode: `#${user_id.split('#')[1]}`
    }))
    dispatch(setGlobalColor({ color: user_color }));
    emitSocketEvent['joining-to-chat']({
      room_code: room_code,
      user: {
        user_id:    user_id,
        user_color: user_color
      },
      fromPublicList: false
    })
  }

  const handleRemoving = (room_code) => {
    setHistory(removeRoomFromHistory(room_code))
  }
  
  return (
    <section className='rooms-history'>
      {
        history.length > 0 &&
        < >
          <header>Last 5 rooms</header>
          <ul className='history-list'>
            {
              history.reverse().map((room, i) => (
                <li
                  key={i}
                  className='history-item'
                >
                  <button className='join-room-btn'
                    onClick={() => handleJoiningRoom(room.code, room.logged_as, room.user_color)}
                  >
                    <div className='room-info'>
                      <div className='room-name'>{room.name}</div>
                      <div className='room-code'>{room.code}</div>
                    </div>
                    <div className='logged-as'>
                      Logged as <span className={room.user_color}>
                        {room.logged_as || JSON.stringify(room)}
                      </span>
                    </div>
                  </button>
                  <button className='delete-btn' onClick={(e) => {handleRemoving(room.code); e.stopPropagation()}}>
                    <MdClose/>
                  </button>
                </li>
              ))
            }
          </ul>
        </>
      }
    </section>
  );
}
export default RoomsHistory;
