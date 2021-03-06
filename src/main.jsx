import React    from 'react';
import ReactDOM from 'react-dom';
import { ChatSessionContextProvider } from '@/context/chatSessionContext';
import { OverlayContextProvider }     from '@/context/overlayContext';
import App from './App';
import './index.scss';
import './normalize.scss';

if (import.meta.env.MODE !== 'development')
  console.log = function () {}

ReactDOM.render(
  <React.StrictMode>
    <ChatSessionContextProvider>
    <OverlayContextProvider>
      <App/>
    </OverlayContextProvider>
    </ChatSessionContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
