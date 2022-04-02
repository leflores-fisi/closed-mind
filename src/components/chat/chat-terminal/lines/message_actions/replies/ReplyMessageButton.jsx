import { scrollChatIfIsNear } from "@/Helpers";
import useChatInput from "@/hooks/useChatInput";
import { BsReply } from "react-icons/bs";
import './RepliesStyles.scss';

function ReplyMessageButton({ from, text, color }) {

  const { setMessageReplying } = useChatInput();

  const handleReply = () => {
    setMessageReplying({ from, text, color });
    scrollChatIfIsNear(300);
  }
  
  return (
    <div className='message-action reply-to-message-container'>
      <button className='reply-to-message-btn' onClick={handleReply}>
        <BsReply/>
      </button>
    </div>
  );
}
export default ReplyMessageButton;