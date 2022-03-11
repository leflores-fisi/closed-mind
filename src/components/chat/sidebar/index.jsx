import { useState } from 'react';
import { nanoid } from 'nanoid';
import { userSocket } from '../../userSocket';
import useAppReducer from './../../../hooks/useAppReducer';
import SidebarSection from './SidebarSection';
import WindowHeader from '../../WindowHeader';
import InvitationSection from './InvitationSection';
import './ChatSidebar.scss';

function Sidebar() {

  const {store} = useAppReducer();
  const [roomCodeVisible, setRoomCodeVisible] = useState(false);

  return (
    <aside className='chat-sidebar'>
      <section className='sidebar-information'>
        <WindowHeader title='Sidebar'/>
        <section className='user-information'>
          <div className='user-information__username'>
            <div className='title'>Username:</div>
            <div className={`username`}>
              <span className={`${store.user_color}`}>{store.username}</span>
              <span>{store.user_code}</span>
            </div>
          </div>
          <button
            className='disconnect-user-btn'
            onClick={() => {
              userSocket.disconnect();
            }}
          >Disconnect</button>
        </section>
        <section className='room-information'>
          <SidebarSection title={'📎 Room code:'}   content={
            <>
              <button onClick={() => {setRoomCodeVisible(prev => !prev)}}>👁</button>
              <span className={roomCodeVisible ? '' : 'censored'}>
                <span>{store.room_code}</span>
              </span>
            </>
          }/>
          <SidebarSection title={'👤 Host:'}       content={store.host.user_id}/>
          <SidebarSection title={'🌚 Created at:'} content={store.created_date}/>
          <SidebarSection title={'👥 Users:'}      content={
            store.users ?
              store.users.map(user => (
                <div key={nanoid()}>
                  <span className={user.user_color}>
                    {user.user_id.substring(0, user.user_id.indexOf('#'))}
                  </span>
                  <span className={user.user_color} style={{opacity: 0.6}}>
                    {user.user_id.substring(user.user_id.indexOf('#'))}
                  </span>
                </div>
              ))
            : null
          }/>
        </section>
      </section>
      {store.room_code && store.host.user_id === store.user_id
        ? <InvitationSection/>
        : null
      }
    </aside>
  )
}

export default Sidebar;