import { nanoid } from 'nanoid';
import { userSocket } from '../userSocket';
import useAppReducer from './../../hooks/useAppReducer';
import SidebarSection from './SidebarSection';
import WindowHeader from '../WindowHeader';
import './ChatSidebar.scss';

function Sidebar() {

  const {store} = useAppReducer();
  const chatSession = store;

  return (
    <fieldset className='chat-sidebar'>
      <WindowHeader title='Sidebar'/>
      <div className='user-information'>
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
            console.log('Button:', store)
          }}
        >Disconnect</button>
      </div>
      <div className='chat-information'>
        <SidebarSection title={'📎 Room code:'}   content={chatSession.room_id}/>
        <SidebarSection title={'👤 Host:'}       content={chatSession.host}/>
        <SidebarSection title={'🌚 Created at:'} content={chatSession.created_date}/>
        <SidebarSection title={'👥 Users:'}      content={
          chatSession.users ?
            chatSession.users.map((user) => <div key={nanoid()}>- {user.user_id}</div>)
          : null
        }/>
      </div>
    </fieldset>
  )
}

export default Sidebar;