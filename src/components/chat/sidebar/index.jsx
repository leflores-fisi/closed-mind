import { nanoid } from 'nanoid';
import { userSocket } from '../../userSocket';
import useAppReducer from './../../../hooks/useAppReducer';
import SidebarSection from './SidebarSection';
import WindowHeader from '../../WindowHeader';
import './ChatSidebar.scss';
import InvitationSection from './InvitationSection';

function Sidebar() {

  const {store} = useAppReducer();
  const chatSession = store;

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
          <SidebarSection title={'📎 Room code:'}   content={chatSession.room_id}/>
          <SidebarSection title={'👤 Host:'}       content={chatSession.host}/>
          <SidebarSection title={'🌚 Created at:'} content={chatSession.created_date}/>
          <SidebarSection title={'👥 Users:'}      content={
            chatSession.users ?
              chatSession.users.map((user) => <div key={nanoid()}>- {user.user_id}</div>)
            : null
          }/>
        </section>
      </section>
      {store.room_id && store.host === store.user_id
        ? <InvitationSection/>
        : null
      }
    </aside>
  )
}

export default Sidebar;