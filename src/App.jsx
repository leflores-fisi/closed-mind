import { Route, useLocation } from 'wouter';
import { useEffect }    from 'react';

import WelcomeWindow    from './components/welcome'
import InvitationWindow from './components/invitations/InvitationWindow';
import Chat             from './components/chat/Chat'
import useAppReducer    from './hooks/useAppReducer';
import './App.scss';
import JoiningRoomWindow from './components/room-joining/JoiningRoomWindow';

function App() {
  const {store} = useAppReducer();
  const [location, setLocation] = useLocation();
  const routes = ['/room', '/invite'];
  
  useEffect(() => {
    if (!routes.some(route => location.startsWith(route))) {
      setLocation('/')
    }
  }, [])

  return (
    <div className='app'>
      <div className='app-content'>
      {
        store.socket_is_connected
          ? < >
              <Route path='/invite/:code' component={Chat}/>
              <Route path='/room/:room'      component={Chat}/>
              <Route path='/'              component={Chat}/>
            </>

          : < >
              <Route path='/invite/:code' component={InvitationWindow}/>
              <Route path='/room/:room'    component={JoiningRoomWindow}/>
              <Route path='/'              component={WelcomeWindow}/>
            </>
      }
      </div>
    </div>
  );
}

export default App;
