
export function pxToNumber(px) {
  return Number(px.replace('px', ''));
}

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