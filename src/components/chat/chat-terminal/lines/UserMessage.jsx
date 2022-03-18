import React, { useEffect, useState, memo } from 'react';
import useDateFormatter from '../../../../hooks/useDateFormatter';
import useChatConfig from '../../../../hooks/useChatConfig';

function UserMessage({ date, userId, userColor, text }) {

  const {userCodeVisible} = useChatConfig();
  const formattedDate = useDateFormatter(date);
  const [formattedTextOnBlocks, setFormattedText] = useState(null);

  /* This check if the message contains links and if it does it formats them as anchors <a/>
   *
   * Sample: text = "Check https://artsandculture.google.com and search for Blob Opera, its just WOW"
   * Outputs: [
   *   (0): <span>Check </span>,
   *   (1): <a ...>https://artsandculture.google.com</a>,
   *   (2): <span> and search for Blob Opera, its just WOW</span>
   * ]
  */
  const FormatTextOnBlocks = () => {
    let words = text.split(' ');
    let TextBlocks = [];
    let pendingBlock = [];
    let lastWasLink = false;

    for (let i = 0; i < words.length; i++) {
      let word = words[i];

      if ((word.startsWith('http://') || word.startsWith('https://')) && word.includes('.') && word.at(-1) !== '.') {
        if (i !== 0)
          TextBlocks.push(<span>{(lastWasLink || TextBlocks.length === 0 ? '' : ' ') + pendingBlock.join(' ').concat(' ')}</span>);
        TextBlocks.push(<a target='_blank' href={word}>{word}</a>)
        pendingBlock.length = 0;
        lastWasLink = true;
      }
      else {
        pendingBlock.push(word);
        lastWasLink = false;
      };
    }
    if (pendingBlock.length > 0) TextBlocks.push(<span>{(TextBlocks.length === 0 ? '' : ' ') + pendingBlock.join(' ')}</span>)
    return TextBlocks.map((block, i) => <React.Fragment key={i}>{block}</React.Fragment>);
  }

  useEffect(() => {
    setFormattedText(FormatTextOnBlocks());
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
        {formattedTextOnBlocks}
      </span>
    </div>
  );
}
export default memo(UserMessage);