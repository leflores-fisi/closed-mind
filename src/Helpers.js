

export function isURL(str) {
  return (
    (str.startsWith('http://') || str.startsWith('https://')) &&
    (str.includes('.') && str.at(-1) !== '.')
  );
}

export function isYoutubeURL(URL) {
  return (
    URL.startsWith('https://www.youtube.com/watch?') ||
    URL.startsWith('https://youtube.com/watch?') ||
    URL.startsWith('https://youtube.com/shorts/') ||
    URL.startsWith('https://www.youtube.com/shorts/') ||
    URL.startsWith('https://www.youtube.com/playlist?list') ||
    URL.startsWith('https://youtu.be/') ||
    URL.startsWith('https://www.youtu.be/')
  )
}

export function getYoutubeID(YOUTUBE_URL) {
  let queries = ['watch?v=', 'shorts/', 'youtu.be/', 'playlist?list='];
  let videoID;
  
  queries.forEach((query, i) => {
    if (YOUTUBE_URL.includes(query)) {
      let youtubeIdLength = (i === 3 ? 34 : 11);
			let start = YOUTUBE_URL.indexOf(query)+query.length
  		videoID = YOUTUBE_URL.substring(start, start + youtubeIdLength);
    }
  })
  return videoID;
}

export function isEmptyObject(obj) {
  if (typeof obj !== 'object') return false;
  for (let i in obj) return false;
  return true;
}

export function scrollChatIfIsNear(distance = 200) {
  const Wrapper = document.querySelector('.command-lines-wrapper');
  const LinesHeight = document.querySelector('.command-lines').getBoundingClientRect().height;

  if (LinesHeight - (Wrapper.scrollTop + Wrapper.getBoundingClientRect().height) < distance) {
    Wrapper.scrollTo(0, LinesHeight);
  }
}

export function scrollChatToBottom() {
  const Wrapper = document.querySelector('.command-lines-wrapper');
  const LinesHeight = document.querySelector('.command-lines').getBoundingClientRect().height;
  Wrapper.scrollTo(0, LinesHeight);

  console.log('Scrolling chat to bottom')
}

export function writeOnChatInput(text) {
  let ChatInput = document.querySelector('.textarea-input');
  ChatInput.value = text;
  ChatInput.focus();
}

export function roomNameFromCode(code) {
  return code.substring(0, code.length - 5);
}