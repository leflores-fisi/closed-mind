import { useState } from 'react';
import { nanoid } from 'nanoid';
import useAppReducer from './../../../hooks/useAppReducer';
import SidebarSection from './SidebarSection';

function RoomInformation() {

  const {store} = useAppReducer();
  const [roomCodeVisible, setRoomCodeVisible] = useState(false);
  
  return (
    <section className='room-information'>
      <SidebarSection title={'📎 Room code:'} content={
        <div className='room-code-box'>
          <button onClick={() => {setRoomCodeVisible(prev => !prev)}}>👁</button>
          <input
            className={`room-code ${roomCodeVisible ? '' : 'censored'}`}
            readOnly
            value={store.room_code}/>
        </div>
      }/>
      <SidebarSection title={'👤 Host:'} content={
        <div>
          <span className={store.host.user_color}>
            {store.host.user_id.substring(0, store.host.user_id.indexOf('#'))}
          </span>
          <span className={store.host.user_color} style={{opacity: 0.6}}>
            {store.host.user_id.substring(store.host.user_id.indexOf('#'))}
          </span>
        </div>
      }/>
      <SidebarSection title={'🌚 Created at:'} content={store.created_date}/>
      <SidebarSection title={'👥 Users:'} content={
        store.users ?
          store.users.map(user => (
            <div key={nanoid()}>
              <span className={user.user_color}>
                {user.user_id.substring(0, user.user_id.indexOf('#'))}
              </span>
              <span className={user.user_color} style={{opacity: 0.4}}>
                {user.user_id.substring(user.user_id.indexOf('#'))}
              </span>
            </div>
          ))
        : null
      }/>
    </section>
  );
}
export default RoomInformation;