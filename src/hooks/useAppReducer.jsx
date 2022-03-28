import { useContext } from 'react';
import { chatSessionContext } from '@/context/chatSessionContext';

const useAppReducer = () => {
  return useContext(chatSessionContext);
}
export default useAppReducer;