import { useEffect, useState, useCallback } from 'react';
import useDateFormatter from '../../../../hooks/useDateFormatter';
import useChatConfig from '../../../../hooks/useChatConfig';

function UserMessage({ date, userId, userColor, text }) {

  const {userCodeVisible} = useChatConfig();
  const formattedDate = useDateFormatter(date);
  const [formattedText, setFormattedText] = useState(null);

  // This check if the message contains links and if it does it formats them as anchors <a/>
  const FormatText = useCallback(() => {
    let words = text.split(' ');
    let pending = [];
    let elements = [];
    let lastWasLink = false;

    for (let i = 0; i < words.length; i++) {
      let word = words[i];

      if ((word.startsWith('http://') || word.startsWith('https://')) && word.includes('.') && word.at(-1) !== '.') {
        if (i !== 0)
          elements.push(<span>{(lastWasLink || elements.length === 0 ? '' : ' ') + pending.join(' ').concat(' ')}</span>);
        elements.push(<a href={word}>{word}</a>)
        pending.length = 0;
        lastWasLink = true;
      }
      else {
        pending.push(word);
        lastWasLink = false;
      };
    }
    if (pending.length > 0) elements.push(<span>{(elements.length === 0 ? '' : ' ') + pending.join(' ')}</span>)
    return elements;
  }, [])
  useEffect(() => {
    setFormattedText(FormatText());
  }, [])
  
  return (
    <div>
      <time className='date'>{formattedDate}</time>
      <span className='from'>
        <span className={userColor}>
          {userId.substring(0, userId.indexOf('#')).concat(!userCodeVisible ? ':' : '')}
        </span>
        {
          userCodeVisible && 
            <span className={userColor} style={{opacity: 0.55}}>
              {userId.substring(userId.indexOf('#')).concat(':')}
            </span>
        }
      </span>
      <span className='text'>
        {formattedText}
      </span>
    </div>
  );
}
export default UserMessage;