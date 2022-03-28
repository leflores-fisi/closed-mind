import { userSocket } from '@/services/userSocket';
import WindowHeader   from '@/components/WindowHeader'

import useAppReducer from '@/hooks/useAppReducer';
import useOverlay    from '@/hooks/useOverlay';

import RoomInformation   from './RoomInformation';
import InvitationSection from './InvitationSection';

import closedmind_logo from '@/assets/logos/closedmind.png';
import './ChatSidebar.scss';

function Sidebar() {

  const {store} = useAppReducer();
  const {onMobileRes} = useOverlay();

  return (
    <aside className={`chat-sidebar ${onMobileRes ? 'mobile' : ''}`}>
      <WindowHeader title='Sidebar'/>
      <picture className='closedmind-logo'>
        <img src={closedmind_logo}/>
        <div>closedmind</div>
      </picture>
      <section className='sidebar-information'>
        <section className='user-information'>
          <div className='user-information__username'>
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