import useChatConfig  from '../../../hooks/useChatConfig';
import HoverableTitle from '../../overlay/HoverableTitle';

function ChatOptions() {
  const {setServerLogVisible, setUserCodeVisible} = useChatConfig();

  return (
    <div className='chat-options' data-title={'hola'}>
      <HoverableTitle title='Toggle server logs' direction='down'>
        <button onClick={() => {setServerLogVisible(prev => !prev)}}>s</button>
      </HoverableTitle>
      <HoverableTitle title='Toggle hashes' direction='down'>
        <button onClick={() => {setUserCodeVisible(prev => !prev)}}>#</button>
      </HoverableTitle>
    </div>
  );
}
export default ChatOptions;