import Sidebar from './components/sidebar';
import WelcomeWindow from './components/welcome'
import useAppReducer from './hooks/useAppReducer';
import ChatTerminal from './components/chat-terminal'
import './App.scss';

function App() {
  const {store} = useAppReducer();

  return (
    <div className="app">
      <div className='app-content'>
        {store.socket_is_connected && <Sidebar/>}
        <div className='main-window'>
          {store.socket_is_connected
            ? <ChatTerminal/>
            : <WelcomeWindow/>}
        </div>
      </div>
    </div>
  );
}

export default App;
