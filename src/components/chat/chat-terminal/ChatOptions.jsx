import useChatConfig  from '../../../hooks/useChatConfig';
import Focusable from '../../Focusable';

function ChatOptions() {
  const {setServerLogVisible, setUserCodeVisible} = useChatConfig();

  return (
    <div className='chat-options' data-title={'hola'}>
      <Focusable title='Toggle server logs' direction='down'>
        <button onClick={() => {setServerLogVisible(prev => !prev)}}>s</button>
      </Focusable>
      <Focusable title='Toggle hashes' direction='down'>
        <button onClick={() => {setUserCodeVisible(prev => !prev)}}>#</button>
      </Focusable>
    </div>
  );
}
export default ChatOptions;