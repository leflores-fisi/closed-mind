import useChatConfig  from '../../../hooks/useChatConfig';

function ChatOptions() {
  const {setServerLogVisible, setUserCodeVisible} = useChatConfig();

  return (
    <div className='chat-options' data-title={'hola'}>
      <button onClick={() => {setServerLogVisible(prev => !prev)}}>s</button>
      <button onClick={() => {setUserCodeVisible(prev => !prev)}}>#</button>
    </div>
  );
}
export default ChatOptions;