import { useContext } from 'react';
import { chatConfigContext } from './../context/chatConfigContext';

const useChatConfig = () => {
  return (useContext(chatConfigContext));
}
export default useChatConfig;