import Header from './components/Header';
import Sidebar from './components/sidebar';
import WelcomeWindow from './components/welcome'
import useAppReducer from './hooks/useAppReducer';
import ChatTerminal from './components/chat-terminal'
import './App.scss';

function App() {
  const {store} = useAppReducer();

  return (
    <div className="app">
      <Header/>
      <div className='app-content'>
        {store.is_connected && <Sidebar/>}
        <div className='main-window'>
          {store.is_connected
            ? <ChatTerminal/>
            : <WelcomeWindow/>}
        </div>
      </div>
    </div>
  );
}

export default App;
