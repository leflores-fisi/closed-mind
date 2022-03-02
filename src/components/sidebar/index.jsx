import { nanoid } from 'nanoid';
import useAppReducer from './../../hooks/useAppReducer';
import { disconnectSocket } from '../../context/actions';
import SidebarSection from './SidebarSection';
import { userSocket } from '../userSocket';
import './ChatSidebar.scss';

function Sidebar() {

  const {store, dispatch} = useAppReducer();
  const chatSession = store;

  return (
    <fieldset className='chat-sidebar'>
      <div className='user-information'>
        <div className='user-information__username'>
          <div className='title'>Username:</div>
          <div className='username'>{store.user_id}</div>
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