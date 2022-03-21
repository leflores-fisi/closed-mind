import useAppReducer from '../../../hooks/useAppReducer';
import useChatConfig  from '../../../hooks/useChatConfig';
import HoverableTitle from '../../overlay/HoverableTitle';
import { emitSocketEvent } from '../../userSocket';

function ChatOptions() {
  const {setServerLogVisible, setUserCodeVisible} = useChatConfig();
  const {store} = useAppReducer();

  return (
    <div className='chat-options' data-title={'hola'}>
      <HoverableTitle title='Toggle server logs' direction='down'>
        <button onClick={() => {setServerLogVisible(prev => !prev)}}>s</button>
      </HoverableTitle>
      <HoverableTitle title='Toggle hashes' direction='down'>
        <button onClick={() => {setUserCodeVisible(prev => !prev)}}>#</button>
      </HoverableTitle>
      <HoverableTitle title='Exit room' direction='down'>
        <button onClick={() => {emitSocketEvent['leaving-from-chat']()}}>💨</button>
      </HoverableTitle>
    </div>
  );
}
export default ChatOptions;