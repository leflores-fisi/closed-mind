import { userSocket } from '../../userSocket';
import useAppReducer from './../../../hooks/useAppReducer';
import WindowHeader from '../../WindowHeader';
import InvitationSection from './InvitationSection';
import RoomInformation from './RoomInformation';
import useOverlay from '../../../hooks/useOverlay';
import './ChatSidebar.scss';

function Sidebar() {

  const {store} = useAppReducer();
  const {onMobileRes} = useOverlay();

  return (
    <aside className={`chat-sidebar ${onMobileRes ? 'mobile' : ''}`}>
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
          >Disconnect
          </button>
        </section>
        {
          store.room_code
          ? <RoomInformation/>
          : null
        }
      </section>
      {store.room_code && store.host.user_id === store.user_id
        ? <InvitationSection/>
        : null
      }
    </aside>
  )
}

export default Sidebar;