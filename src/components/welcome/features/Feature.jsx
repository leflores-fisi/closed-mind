import {BsTerminal} from 'react-icons/bs';
import {IoPeopleOutline} from 'react-icons/io5';

function Feature({ icon, title, description }) {
  
  return (
    <div className='wrapper'>
      <BsTerminal className='icon' size='25px' color='var(--app-color)'/>
      <div className='content'>
        <div className='title'>{title}</div>
        <div className='description'>{description}</div>
      </div>
    </div>
  );
}
export default Feature;