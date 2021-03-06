import React, { useEffect, useState, memo } from 'react';
import useChatConfig    from '@/hooks/useChatConfig';
import { getYoutubeID, isURL, isYoutubeURL } from '@/Helpers';
import { BsArrow90DegRight } from 'react-icons/bs';
import YoutubeEmbed  from '../chat-interactive/YoutubeEmbed';
import CopyURLButton from '../chat-interactive/CopyURLButton';
import MessageHour from './MessageHour';

function UserMessage({ date, userId, userColor, text, messageReplying}) {

  const {userCodeVisible} = useChatConfig();
  const [formattedTextOnBlocks, setFormattedText] = useState(null);
  const [youtubeEmbed, setYoutubeEmbed] = useState(null);

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
    let words = text.split(/(\s|\n)/g).filter(block => block !== ' ');
    let TextBlocks = [];
    let pendingBlock = [];
    let lastWasLink = false;

    for (let i = 0; i < words.length; i++) {
      let word = words[i];

      if (isURL(word)) {
        if (i !== 0) {
          TextBlocks.push(<span>{((lastWasLink || TextBlocks.length === 0 ? '' : ' ') + pendingBlock.join(' ').concat(' ')) || ' '}</span>);
        }
        TextBlocks.push(
          <span className='url-wrapper'>
            <a target='_blank' href={word}>{word}</a>
            <CopyURLButton URL={word}/>
          </span>
        )
        pendingBlock.length = 0;
        lastWasLink = true;

        if (isYoutubeURL(word)) {
          let youtubeVideoId = getYoutubeID(word);
          let isPlaylist = (youtubeVideoId.length === 34);
          setYoutubeEmbed(<YoutubeEmbed key='yt-embed' id={youtubeVideoId} isPlaylist={isPlaylist}/>);
        }
      }
      else {
        pendingBlock.push(word);
        lastWasLink = false;
      };
    }
    if (pendingBlock.length > 0)
      TextBlocks.push(<span>{(TextBlocks.length === 0 ? '' : ' ') + pendingBlock.join(' ')}</span>);
    
    const ReactElements = TextBlocks.map((block, i) => <React.Fragment key={i}>{block}</React.Fragment>);
    return ReactElements;
  }

  useEffect(() => {
    if (text) setFormattedText(FormatTextOnBlocks());
  }, [])
  
  return (
    < >
      <div className='content-wrapper'>
        {
          messageReplying &&
          <div className='replying-to'>
            <div className='message-replying'>
              <BsArrow90DegRight className='icon'/>
              <span>To</span>
              <span className={`${messageReplying?.color}`}>{messageReplying?.from}:</span>
              <span className='reply-text'>{messageReplying?.text}</span>
            </div>
          </div>
        }
        <div className='content'>
          <MessageHour date={date}/>
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
          {
            text &&
            <span className='text'>
              {formattedTextOnBlocks}
            </span>
          }
        </div>
        {youtubeEmbed}
      </div>
    </>
  );
}
export default memo(UserMessage, () => true);