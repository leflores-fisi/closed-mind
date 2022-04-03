import { Route, useLocation } from 'wouter';
import { useEffect }          from 'react';

import useAppReducer from '@/hooks/useAppReducer';
import WelcomeWindow    from '@/components/welcome'
import InvitationPage from '@/components/invitations/InvitationPage';
import Chat             from '@/components/chat/Chat'
import AppOverlay       from '@/components/overlay/AppOverlay';
import './App.scss';

function App() {
  const {store} = useAppReducer();
  const [location, setLocation] = useLocation();
  const routes = ['/invite'];

  useEffect(() => {
    if (!routes.some(route => route === location.substring(0, location.substring(1).indexOf('/') + 1))) {
      setLocation('/')
    }
  }, [])

  return (
    <div className='app'>
      <div className='app-content'>
      {
        store.socket_is_connected
          ? <Chat/>
          : < >
              <Route path='/invite/:code' component={InvitationPage}/>
              <Route path='/'             component={WelcomeWindow}/>
            </>
      }
      </div>
      <AppOverlay/>
    </div>
  );
}

export default App;
