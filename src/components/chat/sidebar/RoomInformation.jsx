import { useState } from 'react';
import useAppReducer from '@/hooks/useAppReducer';
import SidebarSection from './SidebarSection';
import HoverableTitle from '@/components/overlay/HoverableTitle';
import { writeOnChatInput } from '@/Helpers';

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
      <SidebarSection title={'🌚 Created at:'} content={
        store.created_date
      }/>
      <SidebarSection title={'👥 Users:'} content={
        <ul className='users-online-list'>
          {
            store.users?.map(user => (
              <li key={user.user_id} className='user'>
                <div>
                  <span className={user.user_color}>
                    {user.user_id.substring(0, user.user_id.indexOf('#'))}
                  </span>
                  <span className={user.user_color} style={{opacity: 0.4}}>
                    {user.user_id.substring(user.user_id.indexOf('#'))}
                  </span>
                </div>
                {
                  (store.host.user_id === store.user_id && user.user_id !== store.user_id) &&
                    <HoverableTitle title={`ban ${user.user_id}`}>
                      <button onClick={() => {
                        writeOnChatInput(`/ban ${user.user_id}`)
                      }}>x</button>
                    </HoverableTitle>
                }
              </li>
            ))
          }
        </ul>
      }/>
    </section>
  );
}
export default RoomInformation;