import HoverableTitle from '@/components/overlay/HoverableTitle';
import { formatDate } from '@/Helpers';

function MessageHour({ date }) {

  const formattedDate = formatDate(date);
  
  return (
    <HoverableTitle title={formattedDate.day}>
      <time className='date' dateTime={formattedDate.day}>
        {formattedDate.hour}
      </time>
    </HoverableTitle>
  );
}
export default MessageHour;