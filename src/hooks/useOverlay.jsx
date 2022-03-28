import { useContext } from 'react';
import { overlayContext } from '@/context/overlayContext';

const useOverlay = () => {
  return (useContext(overlayContext));
}
export default useOverlay;